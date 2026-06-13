const SIGHT_ENGINE_BASE = "https://api.sightengine.com/1.0";

function inferType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "ogg", "flac", "m4a", "opus"].includes(ext)) return "audio";
  return "image";
}

function buildSightForm(mediaBuffer, filename, mediaType, apiUser, apiSecret) {
  const form = new FormData();
  const mime = mediaType === "image" ? "image/jpeg" : mediaType === "audio" ? "audio/mpeg" : "video/mp4";
  const blob = new Blob([new Uint8Array(mediaBuffer)], { type: mime });

  const fieldName = mediaType === "audio" ? "audio" : "media";
  form.append(fieldName, blob, filename);

  const models = mediaType === "image" ? "genai,deepfake" : mediaType === "video" ? "genai" : "ai_speech";
  form.append("models", models);

  if (mediaType === "video") {
    form.append("interval", "1");
  }

  form.append("api_user", apiUser);
  form.append("api_secret", apiSecret);

  return form;
}

function endpointForType(mediaType) {
  switch (mediaType) {
    case "image": return `${SIGHT_ENGINE_BASE}/check.json`;
    case "video": return `${SIGHT_ENGINE_BASE}/video/check-sync.json`;
    case "audio": return `${SIGHT_ENGINE_BASE}/audio/check.json`;
    default: throw new Error(`Unsupported media type: ${mediaType}`);
  }
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
    details: {
      ai_generated: aiGen,
      deepfake,
      generators: data.type?.ai_generators ?? {},
    },
  };
}

function parseVideoResult(data) {
  const frames = (data.data?.frames ?? []).map((f) => ({
    position: f.info?.position ?? 0,
    score: f.type?.ai_generated ?? 0,
  }));

  const scores = frames.map((f) => f.score);
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;

  return {
    verdict: maxScore > 0.5 ? "FAKE" : "REAL",
    confidence: Math.round(maxScore * 100),
    reasoning:
      maxScore > 0.5
        ? `AI-generated video detected (peak frame: ${(maxScore * 100).toFixed(0)}%, ${frames.length} frames analyzed)`
        : "No AI generation detected across video frames",
    details: { frames, total_frames: frames.length },
  };
}

function parseAudioResult(data) {
  const score = data.type?.ai_speech ?? 0;

  return {
    verdict: score > 0.5 ? "FAKE" : "REAL",
    confidence: Math.round(score * 100),
    reasoning:
      score > 0.5
        ? `AI-generated speech detected (${(score * 100).toFixed(0)}%)`
        : "No AI-generated speech indicators detected",
    details: { ai_speech: score },
  };
}

export async function analyzeSightEngine(mediaBuffer, filename, mediaType, apiUser, apiSecret) {
  const type = mediaType || inferType(filename);
  const form = buildSightForm(mediaBuffer, filename, type, apiUser, apiSecret);
  const endpoint = endpointForType(type);

  const response = await fetch(endpoint, { method: "POST", body: form });
  const result = await response.json();

  if (result.status !== "success") {
    const msg = result.error?.message || "SightEngine API returned an error";
    const detail = result.error?.type ? ` (${result.error.type})` : "";
    throw new Error(`${msg}${detail}`);
  }

  if (type === "image") return parseImageResult(result);
  if (type === "video") return parseVideoResult(result);
  return parseAudioResult(result);
}

export { inferType };
