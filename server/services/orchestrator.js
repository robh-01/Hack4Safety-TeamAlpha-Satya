import { analyzeSightEngine } from "./sightEngineService.js";
import { analyzeHive } from "./hiveService.js";
import config from "../config/index.js";

export async function analyze(filePath, mediaBuffer, filename, mediaType) {
  const buffer = mediaBuffer || filePath;

  if (mediaType === "video") {
    const { apiKey } = config.hive;
    if (!apiKey) {
      throw new Error("HIVE_API_KEY must be set for video analysis");
    }
    return await analyzeHive(buffer, filename, mediaType, apiKey);
  }

  const { apiUser, apiSecret } = config.sightEngine;
  if (apiUser && apiSecret) {
    return await analyzeSightEngine(buffer, filename, mediaType, apiUser, apiSecret);
  }

  const { apiKey } = config.hive;
  if (apiKey) {
    return await analyzeHive(buffer, filename, mediaType, apiKey);
  }

  throw new Error("No API credentials configured. Set SIGHT_ENGINE_API_USER/SECRET or HIVE_API_KEY");
}
