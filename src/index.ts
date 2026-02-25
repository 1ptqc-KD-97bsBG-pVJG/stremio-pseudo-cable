import { addonBuilder, serveHTTP } from "stremio-addon-sdk";
import { loadChannelsConfig } from "./config";
import { getProgramById } from "./library";
import { getScheduledItem, getUpNextItems } from "./schedule";

const channels = loadChannelsConfig().channels;
const DEFAULT_UP_NEXT_SLOTS = 5;

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
    },
    {
      id: "pseudo-cable-up-next",
      type: "movie",
      name: "Pseudo Cable - Up Next",
      extra: [{ name: "channelId", options: channels.map((c) => c.id), isRequired: true }]
    }
  ]
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler((args: { type: string; id: string; extra?: { channelId?: string } }) => {
  if (!["pseudo-cable-now", "pseudo-cable-up-next"].includes(args.id)) {
    return Promise.resolve({ metas: [] });
  }

  const channel = channels.find((c) => c.id === args.extra?.channelId) ?? channels[0];
  if (!channel) return Promise.resolve({ metas: [] });

  const now = Math.floor(Date.now() / 1000);
  const nowItem = getScheduledItem(channel, now);

  if (args.id === "pseudo-cable-now") {
    return Promise.resolve({
      metas: [
        {
          id: nowItem.program.id,
          type: nowItem.program.type,
          name: `${channel.name}: ${nowItem.program.title}`,
          poster: "https://via.placeholder.com/300x450?text=Pseudo+Cable",
          description: `Now airing on ${channel.name}. ${new Date(nowItem.slotStartUnix * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${new Date(nowItem.slotEndUnix * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}. ${channel.description ?? "Classic favorites scheduled with predictable rotation."}`,
          genres: nowItem.program.genres
        }
      ]
    });
  }

  const upNextItems = getUpNextItems(channel, now, DEFAULT_UP_NEXT_SLOTS);

  return Promise.resolve({
    metas: upNextItems.map((item, index) => ({
      id: item.program.id,
      type: item.program.type,
      name: `${channel.name}: ${item.program.title}`,
      poster: "https://via.placeholder.com/300x450?text=Up+Next",
      description: `Up Next #${index + 1} on ${channel.name}: starts ${new Date(item.slotStartUnix * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`,
      genres: item.program.genres
    }))
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
