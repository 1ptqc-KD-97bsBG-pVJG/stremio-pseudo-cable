import { getProgramById } from "./library";
import { ChannelConfig, ScheduledItem } from "./types";

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function getScheduledItem(channel: ChannelConfig, unixTimeSec: number): ScheduledItem {
  const slotSec = Math.max(1, channel.slotMinutes) * 60;
  const slotIndex = Math.floor(unixTimeSec / slotSec);
  const slotStartUnix = slotIndex * slotSec;
  const slotEndUnix = slotStartUnix + slotSec;

  if (!channel.programIds.length) {
    throw new Error(`Channel ${channel.id} has no programIds configured.`);
  }

  const seed = `${channel.id}:${channel.rotationSeed}:${slotIndex}`;
  const hash = fnv1a32(seed);
  const programIndex = hash % channel.programIds.length;
  const programId = channel.programIds[programIndex];
  const program = getProgramById(programId);

  if (!program) {
    throw new Error(`Program '${programId}' in channel '${channel.id}' is missing from library.`);
  }

  return {
    channelId: channel.id,
    channelName: channel.name,
    slotStartUnix,
    slotEndUnix,
    program
  };
}
