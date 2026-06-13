export type Verdict = "REAL" | "FAKE" | "INCONCLUSIVE" | null;

export function getConfidenceBreakdown(confidence: number) {
  const normalizedConfidence = Number.isFinite(confidence)
    ? Math.max(0, Math.min(100, confidence))
    : 0;

  const fakeConfidence = normalizedConfidence;
  const realConfidence = 100 - normalizedConfidence;

  return {
    realConfidence: Math.round(realConfidence),
    fakeConfidence: Math.round(fakeConfidence),
    manipulationConfidence: Math.round(fakeConfidence),
    authenticityConfidence: Math.round(realConfidence),
  };
}

export function buildExplanation(
  verdict: Verdict,
  reasoning: string,
  details?: {
    aiGenerated?: { verdict: string; score: number };
    deepfake?: { verdict: string; score: number };
    generator?: { name: string; score: number };
    audio?: { verdict: string; score: number };
  },
) {
  const parts: string[] = [];
  const text = reasoning.trim();

  if (text) {
    parts.push(text);
  }

  const positiveSignals: string[] = [];
  const negativeSignals: string[] = [];

  if (details?.aiGenerated) {
    const score = Math.round(details.aiGenerated.score * 100);
    if (details.aiGenerated.verdict === "FAKE") {
      negativeSignals.push(`AI-generated signal detected (${score}%)`);
    } else {
      positiveSignals.push(`No strong AI-generated signal in image content (${score}%)`);
    }
  }

  if (details?.deepfake) {
    const score = Math.round(details.deepfake.score * 100);
    if (details.deepfake.verdict === "FAKE") {
      negativeSignals.push(`Deepfake/manipulation signal detected (${score}%)`);
    } else {
      positiveSignals.push(`No strong deepfake signal detected (${score}%)`);
    }
  }

  if (details?.audio) {
    const score = Math.round(details.audio.score * 100);
    if (details.audio.verdict === "FAKE") {
      negativeSignals.push(`Audio analysis suggests synthetic content (${score}%)`);
    } else {
      positiveSignals.push(`Audio analysis does not show strong synthetic cues (${score}%)`);
    }
  }

  if (details?.generator?.name && details.generator.name !== "none") {
    positiveSignals.push(`Possible generator match: ${details.generator.name} (${Math.round(details.generator.score * 100)}%)`);
  }

  if (verdict === "REAL") {
    parts.unshift("The model currently sees more authentic than synthetic signals.");
  } else if (verdict === "FAKE") {
    parts.unshift("The model currently sees more synthetic or manipulated signals.");
  } else {
    parts.unshift("The model does not have enough signal for a strong decision.");
  }

  if (negativeSignals.length) {
    parts.push(negativeSignals.join(" "));
  }

  if (positiveSignals.length) {
    parts.push(positiveSignals.join(" "));
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}
