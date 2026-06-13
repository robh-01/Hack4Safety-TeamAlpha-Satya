export default {
  port: parseInt(process.env.PORT, 10) || 3000,
  upload: {
    maxFileSize: 50 * 1024 * 1024,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
    ],
    dest: "uploads/",
  },
  sightEngine: {
    apiUser: process.env.SIGHT_ENGINE_API_USER || "",
    apiSecret: process.env.SIGHT_ENGINE_API_SECRET || "",
  },
};
