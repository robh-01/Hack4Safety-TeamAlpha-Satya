export default {
  port: parseInt(process.env.PORT, 10) || 3000,
  upload: {
    maxFileSize: 50 * 1024 * 1024,
    allowedMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
    dest: "uploads/",
  },
  sightEngine: {
    apiUser: process.env.SIGHT_ENGINE_API_USER || "",
    apiSecret: process.env.SIGHT_ENGINE_API_SECRET || "",
  },
};
