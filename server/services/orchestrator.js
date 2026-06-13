import { analyzeMetadata } from "./metadataService.js";
import { analyzePixels } from "./pixelService.js";

export async function analyze(filePath) {
  const [metadataResult, pixelResult] = await Promise.all([
    analyzeMetadata(filePath),
    analyzePixels(filePath),
  ]);

  return {
    metadata: metadataResult,
    pixel: pixelResult,
  };
}
