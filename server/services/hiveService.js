import { readFile } from "node:fs/promises";

const HIVE_ENDPOINT =
  "https://api.thehive.ai/api/v3/hive/ai-generated-and-deepfake-content-detection";
const THRESHOLD_AI_IMAGE = 0.9;
const THRESHOLD_AI_VIDEO = 0.9;
const THRESHOLD_DEEPFAKE_IMAGE = 0.9;
const THRESHOLD_DEEPFAKE_VIDEO = 0.5;

function inferType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const imgExts = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
  const vidExts = ["mp4", "webm", "avi", "mkv", "wmv", "mov", "m4v"];
  if (imgExts.includes(ext)) return "image";
  if (vidExts.includes(ext)) return "video";
  return null;
}

function mimeFromName(filename) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    mp4: "video/mp4",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    wmv: "video/x-ms-wmv",
    mov: "video/quicktime",
    m4v: "video/mp4",
  };
  return map[ext] || "application/octet-stream";
}

function aggregateResults(output) {
  const aggScores = {};
  for (const frame of output) {
    for (const c of frame.classes) {
      const cls = c.class;
      const val = c.value;
      if (cls === "inconclusive" || cls === "inconclusive_video") continue;
      if (
        cls.endsWith("_audio") &&
        frame.extra?.[0]?.name === "frame_index" &&
        output.length > 1
      )
        continue;
      aggScores[cls] = Math.max(aggScores[cls] ?? 0, val);
    }
  }
  return aggScores;
}

function computeVerdict(aggScores, frameCount) {
  const aiGenScore = aggScores["ai_generated"] ?? 0;
  const notAiGenScore = aggScores["not_ai_generated"] ?? 0;
  const deepfakeScore = aggScores["deepfake"] ?? 0;
  const aiAudioScore = aggScores["ai_generated_audio"] ?? 0;

  const isVideo = frameCount > 1;
  const aiThreshold = isVideo ? THRESHOLD_AI_VIDEO : THRESHOLD_AI_IMAGE;
  const dfThreshold = isVideo
    ? THRESHOLD_DEEPFAKE_VIDEO
    : THRESHOLD_DEEPFAKE_IMAGE;

  const generatorModels = {};
  for (const [cls, val] of Object.entries(aggScores)) {
    if (
      cls !== "ai_generated" &&
      cls !== "not_ai_generated" &&
      cls !== "deepfake" &&
      cls !== "ai_generated_audio" &&
      cls !== "not_ai_generated_audio" &&
      !cls.startsWith("inconclusive")
    ) {
      generatorModels[cls] = val;
    }
  }

  let topGenerator = "none";
  let topGenScore = 0;
  for (const [name, score] of Object.entries(generatorModels)) {
    if (name !== "none" && score > topGenScore) {
      topGenerator = name;
      topGenScore = score;
    }
  }

  const isAiGen = aiGenScore >= aiThreshold;
  const isDeepfake = deepfakeScore >= dfThreshold;
  const isAiAudio = aiAudioScore >= aiThreshold;

  let verdict;
  let confidence;
  const parts = [];

  if (isAiGen) {
    verdict = "FAKE";
    confidence = Math.round(aiGenScore * 100);
    parts.push(`AI-generated content detected (confidence: ${confidence}%)`);
  } else if (isDeepfake) {
    verdict = "FAKE";
    confidence = Math.round(deepfakeScore * 100);
    parts.push(`Deepfake manipulation detected (confidence: ${confidence}%)`);
  } else if (isAiAudio) {
    verdict = "FAKE";
    confidence = Math.round(aiAudioScore * 100);
    parts.push(`AI-generated audio detected (confidence: ${confidence}%)`);
  } else {
    verdict = "REAL";
    confidence = Math.round(notAiGenScore * 100);
    parts.push("No AI-generated or deepfake manipulation detected");
  }

  if (topGenScore > 0.3) {
    parts.push(`Likely generator: ${topGenerator}`);
  }

  if (isAiGen && aiAudioScore > 0.5) {
    parts.push("Visual and audio content show signs of AI generation");
  } else if (isAiAudio && !isAiGen) {
    parts.push("Audio appears AI-generated while visuals appear authentic");
  }

  if (isVideo) {
    parts.push(`Analyzed ${frameCount} video frames`);
  }

  return {
    verdict,
    confidence,
    reasoning: parts.join(". "),
    details: {
      aiGenerated: {
        verdict: aiGenScore >= aiThreshold ? "FAKE" : "REAL",
        score: Number(aiGenScore.toFixed(4)),
      },
      deepfake: {
        verdict: deepfakeScore >= dfThreshold ? "FAKE" : "REAL",
        score: Number(deepfakeScore.toFixed(4)),
      },
      generator: {
        name: topGenScore > 0.3 ? topGenerator : "none",
        score: Number(topGenScore.toFixed(4)),
      },
      audio:
        aiAudioScore > 0 || aggScores["not_ai_generated_audio"] > 0
          ? {
              verdict: aiAudioScore >= aiThreshold ? "FAKE" : "REAL",
              score: Number(aiAudioScore.toFixed(4)),
            }
          : undefined,
    },
    frameCount: isVideo ? frameCount : undefined,
  };
}

export async function analyzeHive(mediaInput, filename, _mediaType, apiKey) {
  let file;
  const mime = mimeFromName(filename);

  if (typeof mediaInput === "string") {
    const buffer = await readFile(mediaInput);
    file = new Blob([buffer], { type: mime });
  } else {
    file = new Blob([mediaInput], { type: mime });
  }

  const form = new FormData();
  form.append("media", file, filename);

  const response = await fetch(HIVE_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(`Hive API error (${response.status}): ${errText}`);
  }

  const data = await response.json();

  if (!data.output || !Array.isArray(data.output) || data.output.length === 0) {
    throw new Error("No analysis results returned from Hive API");
  }

  const frameCount = data.output.length;
  const aggScores = aggregateResults(data.output);
  return computeVerdict(aggScores, frameCount);
}

export { inferType };
