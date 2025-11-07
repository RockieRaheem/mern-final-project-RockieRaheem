import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a question title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    body: {
      type: String,
      required: [true, "Please provide question details"],
      maxlength: [2000, "Question body cannot be more than 2000 characters"],
    },
    subject: {
      type: String,
      required: [true, "Please select a subject"],
      enum: [
        "Biology",
        "Chemistry",
        "Physics",
        "Mathematics",
        "English",
        "History",
        "Geography",
        "Economics",
      ],
    },
    educationLevel: {
      type: String,
      enum: ["O-Level", "A-Level"],
      required: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["open", "answered", "closed"],
      default: "open",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    flagged: {
      type: Boolean,
      default: false,
    },
    flagReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
questionSchema.index({ subject: 1, educationLevel: 1 });
questionSchema.index({ author: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ createdAt: -1 });

// Increment views
questionSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

const Question = mongoose.model("Question", questionSchema);

export default Question;
