import assert from "node:assert/strict";
import { getStableBingeGroup, rankStreamCandidates, selectSingleStream, StreamCandidate } from "./autoplay";

function pick(streams: StreamCandidate[], channelId = "101-classics"): StreamCandidate {
  const selected = selectSingleStream(streams, channelId);
  assert.equal(selected.length, 1, "expected one selected stream");
  return selected[0];
}

{
  const base: StreamCandidate[] = [
    { addonId: "org.addon.alpha", name: "Alpha", title: "1080p WEB", quality: "1080p", reliability: 0.9, url: "https://a.example/1" },
    { addonId: "org.addon.beta", name: "Beta", title: "720p WEB", quality: "720p", reliability: 1, url: "https://b.example/1" },
    { addonId: "org.addon.gamma", name: "Gamma", title: "1080p WEB", quality: "1080p", reliability: 0.7, url: "https://c.example/1" }
  ];

  const pickedA = pick(base);
  const pickedB = pick([...base].reverse());
  assert.equal(pickedA.url, pickedB.url, "same stream set should select same best stream regardless of order");
}

{
  const tied: StreamCandidate[] = [
    { addonId: "org.addon.zzz", name: "Stream Z", quality: "1080p", reliability: 0.8, url: "https://z.example/1" },
    { addonId: "org.addon.aaa", name: "Stream A", quality: "1080p", reliability: 0.8, url: "https://a.example/1" }
  ];

  const ranked = rankStreamCandidates(tied);
  assert.equal(ranked[0].addonId, "org.addon.aaa", "tie-breaking must be deterministic via stable identity key");
}

{
  const streamA: StreamCandidate = {
    addonId: "org.addon.alpha",
    title: "Episode 1 - 1080p BluRay",
    quality: "1080p",
    url: "https://alpha.example/e1"
  };

  const streamB: StreamCandidate = {
    addonId: "org.addon.alpha",
    title: "Episode 2 - 1080p WEB-DL",
    quality: "1080p",
    url: "https://alpha.example/e2"
  };

  const groupA = getStableBingeGroup("108-scifi", streamA);
  const groupB = getStableBingeGroup("108-scifi", streamB);

  assert.equal(groupA, groupB, "bingeGroup should be stable for equivalent stream class");
  assert.equal(groupA, "pc-108-scifi-org-addon-alpha-1080p");
}

console.log("Validated autoplay invariants: deterministic single-stream selection + stable bingeGroup.");
