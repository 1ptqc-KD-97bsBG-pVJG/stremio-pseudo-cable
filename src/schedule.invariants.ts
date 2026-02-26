import assert from "node:assert/strict";
import { loadChannelsConfig } from "./config";
import { getScheduledItemAtSlot } from "./schedule";

const channels = loadChannelsConfig().channels;
const SLOTS_TO_VALIDATE = 120;

for (const channel of channels) {
  const windowSlots = Math.max(
    0,
    Math.min(channel.antiRepeatWindowSlots ?? 2, Math.max(0, channel.programIds.length - 1))
  );

  for (let slot = 0; slot < SLOTS_TO_VALIDATE; slot += 1) {
    const current = getScheduledItemAtSlot(channel, slot).program.id;

    for (let lookback = 1; lookback <= windowSlots; lookback += 1) {
      const prevSlot = slot - lookback;
      if (prevSlot < 0) break;

      const previous = getScheduledItemAtSlot(channel, prevSlot).program.id;
      assert.notEqual(
        current,
        previous,
        `${channel.id}: repeated program ${current} in slots ${prevSlot} and ${slot} inside anti-repeat window ${windowSlots}`
      );
    }
  }
}

console.log(`Validated schedule invariants for ${channels.length} channels across ${SLOTS_TO_VALIDATE} slots.`);
