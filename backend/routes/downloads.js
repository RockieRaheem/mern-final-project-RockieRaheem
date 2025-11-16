import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @desc    Download file with original filename
// @route   GET /api/downloads/:filename
// @access  Public
router.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const { originalName } = req.query; // Pass original filename as query param

  const filePath = path.join(__dirname, "../../uploads", filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "File not found",
    });
  }

  // Get file stats
  const stats = fs.statSync(filePath);
  const ext = path.extname(filename).toLowerCase();

  // Set proper Content-Type
  const contentTypes = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogg": "video/ogg",
  };

  const contentType = contentTypes[ext] || "application/octet-stream";

  // Set headers for download
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", stats.size);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${originalName || filename}"`
  );

  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

export default router;
