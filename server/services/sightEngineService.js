import { readFile } from "node:fs/promises";

const SIGHT_ENGINE_BASE = "https://api.sightengine.com/1.0";

function inferType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext) ? "image" : null;
}

function buildSightForm(buffer, filename, apiUser, apiSecret) {
  const form = new FormData();
  const blob = new Blob([buffer], { type: "image/jpeg" });

  form.append("media", blob, filename);
  form.append("models", "genai,deepfake");
  form.append("api_user", apiUser);
  form.append("api_secret", apiSecret);

  return form;
}

function parseImageResult(data) {
  const aiGen = data.type?.ai_generated ?? 0;
  const deepfake = data.type?.deepfake ?? 0;
  const maxScore = Math.max(aiGen, deepfake);

  const reasons = [];
  if (aiGen > 0.5) reasons.push(`AI-generated image (${(aiGen * 100).toFixed(0)}%)`);
  if (deepfake > 0.5) reasons.push(`Face manipulation / deepfake (${(deepfake * 100).toFixed(0)}%)`);
  if (reasons.length === 0) reasons.push("No AI generation or deepfake indicators detected");

  return {
    verdict: maxScore > 0.5 ? "FAKE" : "REAL",
    confidence: Math.round(maxScore * 100),
    reasoning: reasons.join(". "),
  };
}

export async function analyzeSightEngine(mediaInput, filename, _mediaType, apiUser, apiSecret) {
  let buffer;
  if (typeof mediaInput === "string") {
    buffer = await readFile(mediaInput);
  } else {
    buffer = mediaInput;
  }

  const form = buildSightForm(buffer, filename, apiUser, apiSecret);
  const endpoint = `${SIGHT_ENGINE_BASE}/check.json`;

  const response = await fetch(endpoint, { method: "POST", body: form });
  const result = await response.json();

  if (result.status !== "success") {
    const msg = result.error?.message || "SightEngine API returned an error";
    const detail = result.error?.type ? ` (${result.error.type})` : "";
    throw new Error(`${msg}${detail}`);
  }

  return parseImageResult(result);
}

export { inferType };
