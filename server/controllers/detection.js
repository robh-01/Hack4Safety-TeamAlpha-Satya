import { analyze } from "../services/orchestrator.js";
import { inferType } from "../services/sightEngineService.js";
import { removeFile } from "../utils/fileUtils.js";

function ndjson(res, obj) {
  res.write(JSON.stringify(obj) + "\n");
}

export async function detect(req, res, next) {
  try {
    let mediaBuffer;
    let filename;
    let mediaType;

    if (req.file) {
      mediaBuffer = req.file.path;
      filename = req.file.originalname;
      mediaType = inferType(filename);
    } else if (req.body?.media) {
      mediaBuffer = Buffer.from(req.body.media, "base64");
      filename = req.body.filename || "upload";
      mediaType = inferType(filename);
    } else {
      return res.status(400).json({ error: "No media provided. Use multipart/form-data (field: 'media') or application/json (field: 'media' as base64)" });
    }

    if (!mediaType) {
      return res.status(400).json({ error: "Only image files are supported" });
    }

    res.setHeader("Content-Type", "application/x-ndjson");

    ndjson(res, { type: "status", message: `Connecting to SightEngine for ${mediaType} analysis...` });

    const result = await analyze(req.file?.path, mediaBuffer, filename, mediaType);

    ndjson(res, { type: "status", message: "Analysis complete" });
    ndjson(res, { type: "result", data: result });

    res.end();

    if (req.file) {
      await removeFile(req.file.path);
    }
  } catch (err) {
    if (res.headersSent) {
      ndjson(res, { type: "error", message: err.message });
      res.end();
    } else {
      next(err);
    }
  }
}
