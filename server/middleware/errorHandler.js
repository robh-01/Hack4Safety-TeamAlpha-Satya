export default function errorHandler(err, _req, res, _next) {
  console.error("Unhandled error:", err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON" });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large" });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal server error" });
}
