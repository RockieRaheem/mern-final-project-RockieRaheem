import express from "express";
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  upvoteQuestion,
  getUserQuestions,
} from "../controllers/questionController.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import { moderateContent, checkStrikes } from "../middleware/moderation.js";
import upload from "../utils/fileUpload.js";

const router = express.Router();

router
  .route("/")
  .get(optionalAuth, getQuestions)
  .post(
    protect,
    checkStrikes,
    moderateContent,
    upload.array("attachments", 3),
    createQuestion
  );

router
  .route("/:id")
  .get(optionalAuth, getQuestion)
  .put(protect, moderateContent, updateQuestion)
  .delete(protect, deleteQuestion);

router.put("/:id/upvote", protect, upvoteQuestion);
router.get("/user/:userId", getUserQuestions);

export default router;
