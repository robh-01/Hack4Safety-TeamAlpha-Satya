import { Router } from "express";
import upload from "../middleware/upload.js";
import { detect } from "../controllers/detection.js";

const router = Router();

router.post("/detect", upload.single("file"), detect);

export default router;
