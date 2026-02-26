import { getProgramById } from "./library";
import { ChannelConfig, ProgramRef, ScheduledItem } from "./types";

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function getSlotSec(channel: ChannelConfig): number {
  return Math.max(1, channel.slotMinutes) * 60;
}

function getSlotWindow(channel: ChannelConfig): number {
  const configured = channel.antiRepeatWindowSlots ?? 2;
  const capped = Math.min(configured, Math.max(0, channel.programIds.length - 1));
  return Math.max(0, capped);
}

function candidateProgramId(channel: ChannelConfig, slotIndex: number, attempt: number): string {
  const seed = `${channel.id}:${channel.rotationSeed}:${slotIndex}:${attempt}`;
  const hash = fnv1a32(seed);
  const programIndex = hash % channel.programIds.length;
  return channel.programIds[programIndex];
}

function resolveProgramForSlot(
  channel: ChannelConfig,
  slotIndex: number,
  memo: Map<number, ProgramRef>
): void {
  if (memo.has(slotIndex)) return;

  const antiRepeatWindow = getSlotWindow(channel);
  const previousPrograms = new Set<string>();

  for (let i = 1; i <= antiRepeatWindow; i += 1) {
    const prevSlot = slotIndex - i;
    if (prevSlot < 0) break;
    const prev = memo.get(prevSlot);
    if (prev) previousPrograms.add(prev.id);
  }

  const maxAttempts = Math.max(1, channel.programIds.length);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const programId = candidateProgramId(channel, slotIndex, attempt);
    if (previousPrograms.has(programId)) continue;

    const program = getProgramById(programId);
    if (!program) {
      throw new Error(`Program '${programId}' in channel '${channel.id}' is missing from library.`);
    }

    memo.set(slotIndex, program);
    return;
  }

  const fallbackProgramId = candidateProgramId(channel, slotIndex, 0);
  const fallback = getProgramById(fallbackProgramId);

  if (!fallback) {
    throw new Error(`Program '${fallbackProgramId}' in channel '${channel.id}' is missing from library.`);
  }

  memo.set(slotIndex, fallback);
}

const channelMemoCache = new Map<string, Map<number, ProgramRef>>();

function getChannelMemo(channelId: string): Map<number, ProgramRef> {
  let memo = channelMemoCache.get(channelId);
  if (!memo) {
    memo = new Map<number, ProgramRef>();
    channelMemoCache.set(channelId, memo);
  }
  return memo;
}

function ensureSlotComputed(
  channel: ChannelConfig,
  slotIndex: number,
  memo: Map<number, ProgramRef>
): ProgramRef {
  if (memo.has(slotIndex)) {
    return memo.get(slotIndex)!;
  }

  if (!channel.programIds.length) {
    throw new Error(`Channel ${channel.id} has no programIds configured.`);
  }

  for (let s = 0; s <= slotIndex; s += 1) {
    resolveProgramForSlot(channel, s, memo);
  }

  return memo.get(slotIndex)!;
}

export function getScheduledItemAtSlot(channel: ChannelConfig, slotIndex: number): ScheduledItem {
  const slotSec = getSlotSec(channel);
  const slotStartUnix = slotIndex * slotSec;
  const slotEndUnix = slotStartUnix + slotSec;
  const memo = getChannelMemo(channel.id);
  const program = ensureSlotComputed(channel, slotIndex, memo);

  return {
    channelId: channel.id,
    channelName: channel.name,
    slotStartUnix,
    slotEndUnix,
    slotIndex,
    program
  };
}

export function getScheduledItem(channel: ChannelConfig, unixTimeSec: number): ScheduledItem {
  const slotIndex = Math.floor(unixTimeSec / getSlotSec(channel));
  return getScheduledItemAtSlot(channel, slotIndex);
}

export function getUpNextItems(channel: ChannelConfig, unixTimeSec: number, count: number): ScheduledItem[] {
  const clampedCount = Math.max(1, Math.min(6, count));
  const nowSlotIndex = Math.floor(unixTimeSec / getSlotSec(channel));
  const memo = getChannelMemo(channel.id);

  return Array.from({ length: clampedCount }, (_, i) => {
    const slotIndex = nowSlotIndex + i + 1;
    const slotSec = getSlotSec(channel);
    const slotStartUnix = slotIndex * slotSec;
    const slotEndUnix = slotStartUnix + slotSec;
    const program = ensureSlotComputed(channel, slotIndex, memo);

    return {
      channelId: channel.id,
      channelName: channel.name,
      slotStartUnix,
      slotEndUnix,
      slotIndex,
      program
    };
  });
}
