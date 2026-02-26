type StreamBehaviorHints = {
  bingeGroup?: string;
  [key: string]: unknown;
};

export type StreamCandidate = {
  name?: string;
  title?: string;
  url?: string;
  infoHash?: string;
  ytId?: string;
  quality?: string;
  addonId?: string;
  addonName?: string;
  reliability?: number;
  behaviorHints?: StreamBehaviorHints;
  [key: string]: unknown;
};

function normalizeToken(input: string | undefined): string {
  return (input ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "unknown";
}

function inferQualityToken(stream: StreamCandidate): string {
  const source = `${stream.quality ?? ""} ${stream.title ?? ""} ${stream.name ?? ""}`.toLowerCase();

  if (source.includes("2160") || source.includes("4k") || source.includes("uhd")) return "2160p";
  if (source.includes("1080")) return "1080p";
  if (source.includes("720")) return "720p";
  if (source.includes("480")) return "480p";
  if (source.includes("360")) return "360p";
  return "unknown";
}

function qualityScore(stream: StreamCandidate): number {
  const quality = inferQualityToken(stream);
  switch (quality) {
    case "2160p":
      return 5;
    case "1080p":
      return 4;
    case "720p":
      return 3;
    case "480p":
      return 2;
    case "360p":
      return 1;
    default:
      return 0;
  }
}

function reliabilityScore(stream: StreamCandidate): number {
  const raw = typeof stream.reliability === "number" ? stream.reliability : 0;
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(1, raw));
}

function stableIdentityKey(stream: StreamCandidate): string {
  return [
    normalizeToken(stream.addonId),
    normalizeToken(stream.addonName),
    normalizeToken(stream.quality),
    normalizeToken(stream.name),
    normalizeToken(stream.title),
    normalizeToken(stream.infoHash),
    normalizeToken(stream.ytId),
    normalizeToken(stream.url)
  ].join("|");
}

export function rankStreamCandidates(streams: StreamCandidate[]): StreamCandidate[] {
  return [...streams].sort((a, b) => {
    const qualityDiff = qualityScore(b) - qualityScore(a);
    if (qualityDiff !== 0) return qualityDiff;

    const reliabilityDiff = reliabilityScore(b) - reliabilityScore(a);
    if (reliabilityDiff !== 0) return reliabilityDiff;

    return stableIdentityKey(a).localeCompare(stableIdentityKey(b));
  });
}

export function getStableBingeGroup(channelId: string, selectedStream: StreamCandidate): string {
  const source = normalizeToken(selectedStream.addonId || selectedStream.addonName);
  const quality = inferQualityToken(selectedStream);
  return `pc-${normalizeToken(channelId)}-${source}-${quality}`;
}

export function selectSingleStream(streams: StreamCandidate[], channelId: string): StreamCandidate[] {
  if (!streams.length) return [];

  const best = rankStreamCandidates(streams)[0];
  const bingeGroup = getStableBingeGroup(channelId, best);

  return [
    {
      ...best,
      behaviorHints: {
        ...(best.behaviorHints ?? {}),
        bingeGroup
      }
    }
  ];
}
