import express from "express";
import detectionRoutes from "./routes/detection.js";
import errorHandler from "./middleware/errorHandler.js";
import config from "./config/index.js";

const app = express();

app.use(express.json());
app.use("/api", detectionRoutes);
app.use(errorHandler);

export { app, config };
