import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a session title"],
      trim: true,
      maxlength: [150, "Title cannot be more than 150 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
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
    type: {
      type: String,
      enum: ["student-led", "teacher-led", "group-study"],
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        leftAt: Date,
      },
    ],
    maxParticipants: {
      type: Number,
      default: 50,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended", "cancelled"],
      default: "scheduled",
    },
    isRecorded: {
      type: Boolean,
      default: false,
    },
    recordingUrl: {
      type: String,
    },
    chatHistory: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
sessionSchema.index({ host: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ startTime: 1 });
sessionSchema.index({ subject: 1, educationLevel: 1 });

// Add participant
sessionSchema.methods.addParticipant = function (userId) {
  if (this.participants.length >= this.maxParticipants) {
    throw new Error("Session is full");
  }

  const alreadyJoined = this.participants.some(
    (p) => p.user.toString() === userId.toString()
  );

  if (!alreadyJoined) {
    this.participants.push({ user: userId });
  }

  return this.save();
};

const Session = mongoose.model("Session", sessionSchema);

export default Session;
