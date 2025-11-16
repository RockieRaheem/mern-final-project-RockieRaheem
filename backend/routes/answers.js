import express from "express";
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
import upload from "../utils/fileUpload.js";

const router = express.Router();

router.get("/question/:questionId", getAnswersForQuestion);
router.get("/:id", getAnswerById);
router.post(
  "/",
  protect,
  moderateContent,
  upload.array("images", 3),
  createAnswer
);
router.put("/:id/vote", protect, voteAnswer);
router.put("/:id/accept", protect, acceptAnswer);
router.put("/:id/verify", protect, authorize("teacher", "admin"), verifyAnswer);
router.delete("/:id", protect, deleteAnswer);

export default router;
