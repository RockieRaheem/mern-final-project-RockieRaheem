import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, "Message cannot be more than 1000 characters"],
    },
    role: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    context: {
      subject: String,
      topic: String,
      relatedQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "frustrated", "confused"],
    },
    botResponse: {
      type: String,
    },
    helpful: {
      type: Boolean,
    },
    flagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
chatSchema.index({ user: 1, createdAt: -1 });
chatSchema.index({ flagged: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
