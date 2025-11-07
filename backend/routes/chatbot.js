import express from "express";
import {
  chatWithBot,
  getChatHistory,
  markHelpful,
} from "../controllers/chatbotController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, chatWithBot);
router.get("/history", protect, getChatHistory);
router.put("/:id/helpful", protect, markHelpful);

export default router;
