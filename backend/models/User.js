import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    school: {
      type: String,
      required: [true, "Please provide a school name"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "Please provide a district"],
      trim: true,
    },
    subjects: [
      {
        type: String,
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
    ],
    educationLevel: {
      type: String,
      enum: ["O-Level", "A-Level"],
      default: "O-Level",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationProof: {
      type: String, // For teachers - document URL
    },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
    strikes: {
      type: Number,
      default: 0,
      max: 3,
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        name: String,
        awardedAt: Date,
      },
    ],
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    bio: {
      type: String,
      maxlength: [200, "Bio cannot be more than 200 characters"],
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last active
userSchema.methods.updateLastActive = function () {
  this.lastActive = Date.now();
  return this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
