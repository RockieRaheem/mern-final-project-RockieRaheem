import express from "express";
import {
  getSessions,
  getSession,
  createSession,
  joinSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(optionalAuth, getSessions).post(protect, createSession);

router
  .route("/:id")
  .get(optionalAuth, getSession)
  .put(protect, updateSession)
  .delete(protect, deleteSession);

router.put("/:id/join", protect, joinSession);

export default router;
