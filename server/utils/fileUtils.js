import { unlink } from "node:fs/promises";

export async function removeFile(filePath) {
  try {
    await unlink(filePath);
  } catch {
    // File may have already been cleaned up
  }
}
