import express from "express";
import {
  getAnswersForQuestion,
  createAnswer,
  voteAnswer,
  acceptAnswer,
  verifyAnswer,
  deleteAnswer,
} from "../controllers/answerController.js";
import { protect, authorize } from "../middleware/auth.js";
import { moderateContent, checkStrikes } from "../middleware/moderation.js";
import upload from "../utils/fileUpload.js";

const router = express.Router();

router.get("/question/:questionId", getAnswersForQuestion);
router.post(
  "/",
  protect,
  checkStrikes,
  moderateContent,
  upload.array("attachments", 2),
  createAnswer
);
router.put("/:id/vote", protect, voteAnswer);
router.put("/:id/accept", protect, acceptAnswer);
router.put("/:id/verify", protect, authorize("teacher", "admin"), verifyAnswer);
router.delete("/:id", protect, deleteAnswer);

export default router;
