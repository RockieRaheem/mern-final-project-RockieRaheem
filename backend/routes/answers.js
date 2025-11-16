import express from "express";
import multer from "multer";
import {
  getAnswersForQuestion,
  getAnswerById,
  createAnswer,
  voteAnswer,
  acceptAnswer,
  verifyAnswer,
  deleteAnswer,
} from "../controllers/answerController.js";
import { protect, authorize } from "../middleware/auth.js";
import { moderateContent } from "../middleware/moderation.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Debug route for file upload
const debugUpload = multer({ dest: "uploads/" });
router.post("/test-upload", debugUpload.any(), (req, res) => {
  console.log("Test upload req.files:", req.files);
  res.json({ files: req.files });
});

router.get("/question/:questionId", getAnswersForQuestion);
router.get("/:id", getAnswerById);
router.post(
  "/",
  protect,
  moderateContent,
  upload.array("attachments"),
  createAnswer
);
router.put("/:id/vote", protect, voteAnswer);
router.put("/:id/accept", protect, acceptAnswer);
router.put("/:id/verify", protect, authorize("teacher", "admin"), verifyAnswer);
router.delete("/:id", protect, deleteAnswer);

export default router;
