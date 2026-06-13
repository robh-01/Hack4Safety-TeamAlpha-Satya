import { analyze } from "../services/orchestrator.js";
import { removeFile } from "../utils/fileUtils.js";

export async function detect(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const result = await analyze(req.file.path);

    await removeFile(req.file.path);

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
