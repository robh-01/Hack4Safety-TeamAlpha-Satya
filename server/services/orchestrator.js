import { analyzeSightEngine } from "./sightEngineService.js";
import config from "../config/index.js";

export async function analyze(filePath, mediaBuffer, filename, mediaType) {
  const { apiUser, apiSecret } = config.sightEngine;

  if (!apiUser || !apiSecret) {
    throw new Error("SIGHT_ENGINE_API_USER and SIGHT_ENGINE_API_SECRET must be set");
  }

  const buffer = mediaBuffer || filePath;
  const result = await analyzeSightEngine(buffer, filename, mediaType, apiUser, apiSecret);

  return result;
}
