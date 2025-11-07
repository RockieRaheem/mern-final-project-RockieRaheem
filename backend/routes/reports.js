import express from "express";
import {
  createReport,
  getReports,
  updateReport,
} from "../controllers/reportController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createReport);
router.get("/", protect, authorize("admin", "teacher"), getReports);
router.put("/:id", protect, authorize("admin"), updateReport);

export default router;
