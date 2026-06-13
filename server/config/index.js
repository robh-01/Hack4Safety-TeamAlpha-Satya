import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  const envPath = resolve(__dirname, "../.env.local");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local is optional
}

export default {
  port: parseInt(process.env.PORT, 10) || 3000,
  upload: {
    maxFileSize: 50 * 1024 * 1024,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/x-msvideo",
      "video/x-matroska",
      "video/x-ms-wmv",
      "video/quicktime",
    ],
    dest: "uploads/",
  },
  sightEngine: {
    apiUser: process.env.SIGHT_ENGINE_API_USER || "",
    apiSecret: process.env.SIGHT_ENGINE_API_SECRET || "",
  },
  hive: {
    apiKey: process.env.HIVE_API_KEY || "",
  },
};
