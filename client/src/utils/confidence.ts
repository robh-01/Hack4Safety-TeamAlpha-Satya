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
