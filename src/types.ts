export type ProgramRef = {
  id: string; // canonical Stremio ID (e.g. tt0133093)
  type: "movie" | "series";
  title: string;
  genres?: string[];
  runtimeMin?: number;
};

export type ChannelConfig = {
  id: string;
  name: string;
  description?: string;
  timezone?: string;
  slotMinutes: number;
  rotationSeed: string;
  antiRepeatWindowSlots?: number;
  programIds: string[];
};

export type ChannelConfigFile = {
  channels: ChannelConfig[];
};

export type ScheduledItem = {
  channelId: string;
  channelName: string;
  slotStartUnix: number;
  slotEndUnix: number;
  slotIndex: number;
  program: ProgramRef;
};
