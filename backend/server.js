import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Load env vars
dotenv.config();

// Import database connection
import connectDB from "./config/db.js";

// Import middleware
import errorHandler from "./middleware/error.js";

// Import routes
import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/questions.js";
import answerRoutes from "./routes/answers.js";
import sessionRoutes from "./routes/sessions.js";
import reportRoutes from "./routes/reports.js";
import chatbotRoutes from "./routes/chatbot.js";

// Get directory name (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs:
    parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "EduLink UG API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to EduLink UG API",
    version: "1.0.0",
    documentation: "/api/docs",
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`✅ New client connected: ${socket.id}`);

  // Join a room (for sessions/discussions)
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  // Leave a room
  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
    socket.to(roomId).emit("user-left", socket.id);
  });

  // Handle chat messages
  socket.on("chat-message", (data) => {
    io.to(data.roomId).emit("chat-message", {
      userId: socket.id,
      message: data.message,
      timestamp: new Date(),
    });
  });

  // Handle video call signaling
  socket.on("video-offer", (data) => {
    socket.to(data.to).emit("video-offer", {
      from: socket.id,
      offer: data.offer,
    });
  });

  socket.on("video-answer", (data) => {
    socket.to(data.to).emit("video-answer", {
      from: socket.id,
      answer: data.answer,
    });
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.to).emit("ice-candidate", {
      from: socket.id,
      candidate: data.candidate,
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set("io", io);

// Error handler (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║        🎓 EduLink UG Server Running 🇺🇬           ║
║                                                   ║
║     Environment: ${process.env.NODE_ENV?.padEnd(10)} Mode                   ║
║     Port: ${PORT.toString().padEnd(10)}                          ║
║     Socket.IO: ✅ Enabled                         ║
║                                                   ║
║     For God and My Country                       ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

export default app;
