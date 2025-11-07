import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportedContent: {
      contentType: {
        type: String,
        enum: ["question", "answer", "chat", "session", "user"],
        required: true,
      },
      contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
    type: {
      type: String,
      enum: [
        "harassment",
        "spam",
        "inappropriate-content",
        "misinformation",
        "other",
      ],
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewing", "resolved", "dismissed"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    action: {
      type: String,
      enum: [
        "no-action",
        "content-removed",
        "warning-issued",
        "user-suspended",
        "user-banned",
      ],
    },
    notes: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ status: 1 });
reportSchema.index({ reportedUser: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ priority: 1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
