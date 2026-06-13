import { Router } from "express";
import upload from "../middleware/upload.js";
import { detect } from "../controllers/detection.js";

const router = Router();

router.post("/detect", (req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    upload.single("media")(req, res, next);
  } else {
    next();
  }
}, detect);

export default router;
