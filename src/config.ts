import fs from "node:fs";
import path from "node:path";
import { ChannelConfigFile } from "./types";

const DEFAULT_CONFIG_PATH = path.resolve(process.cwd(), "config/channels.json");
const EXAMPLE_CONFIG_PATH = path.resolve(process.cwd(), "config/channels.example.json");

export function loadChannelsConfig(): ChannelConfigFile {
  const explicitPath = process.env.CHANNELS_CONFIG_PATH;
  const configPath = explicitPath ? path.resolve(explicitPath) : DEFAULT_CONFIG_PATH;

  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf-8")) as ChannelConfigFile;
  }

  if (fs.existsSync(EXAMPLE_CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(EXAMPLE_CONFIG_PATH, "utf-8")) as ChannelConfigFile;
  }

  throw new Error(
    `No channel configuration found at ${configPath} (or fallback ${EXAMPLE_CONFIG_PATH}).`
  );
}
