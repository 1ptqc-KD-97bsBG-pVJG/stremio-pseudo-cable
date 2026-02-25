import { addonBuilder, serveHTTP } from "stremio-addon-sdk";
import { loadChannelsConfig } from "./config";
import { getProgramById } from "./library";
import { getScheduledItem } from "./schedule";

const channels = loadChannelsConfig().channels;

const manifest = {
  id: "org.local.pseudocable",
  version: "0.1.0",
  name: "Pseudo Cable (MVP)",
  description: "Deterministic metadata-only pseudo-cable channels",
  resources: ["catalog", "meta"],
  types: ["movie"],
  idPrefixes: ["tt"],
  catalogs: [
    {
      id: "pseudo-cable-now",
      type: "movie",
      name: "Pseudo Cable - On Now",
      extra: [{ name: "channelId", options: channels.map((c) => c.id), isRequired: true }]
    }
  ]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler((args: { type: string; id: string; extra?: { channelId?: string } }) => {
  if (args.id !== "pseudo-cable-now") return Promise.resolve({ metas: [] });

  const channel = channels.find((c) => c.id === args.extra?.channelId) ?? channels[0];
  if (!channel) return Promise.resolve({ metas: [] });

  const now = Math.floor(Date.now() / 1000);
  const nowItem = getScheduledItem(channel, now);

  return Promise.resolve({
    metas: [
      {
        id: nowItem.program.id,
        type: nowItem.program.type,
        name: `${channel.name}: ${nowItem.program.title}`,
        poster: "https://via.placeholder.com/300x450?text=Pseudo+Cable",
        description: `Now airing on ${channel.name}. Slot ${new Date(nowItem.slotStartUnix * 1000).toISOString()} - ${new Date(nowItem.slotEndUnix * 1000).toISOString()}`,
        genres: nowItem.program.genres
      }
    ]
  });
});

builder.defineMetaHandler((args: { id: string }) => {
  const program = getProgramById(args.id);
  if (!program) return Promise.resolve({ meta: null });

  return Promise.resolve({
    meta: {
      id: program.id,
      type: program.type,
      name: program.title,
      genres: program.genres,
      description: "Pseudo Cable metadata entry. Streams are provided by your installed VOD addons."
    }
  });
});

const port = Number(process.env.PORT ?? 7000);
serveHTTP(builder.getInterface(), { port });
console.log(`[pseudo-cable] running on http://127.0.0.1:${port}/manifest.json`);
