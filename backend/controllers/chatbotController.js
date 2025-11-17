import Chat from "../models/Chat.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// System prompt for educational context
const SYSTEM_PROMPT = `You are EduBot, an AI tutor for EduLink Uganda - a platform for O-Level and A-Level students.
Your role is to:
- Help with Biology, Chemistry, Physics, Mathematics, English, History, Geography, and Economics
- Explain concepts clearly for Ugandan secondary school students
- Provide step-by-step solutions for academic problems
- Guide students on using the EduLink platform features
- Be encouraging and supportive

IMPORTANT FORMATTING RULES:
- Keep responses concise (under 250 words), friendly, and educational
- Use simple language suitable for students
- NEVER use markdown formatting like **bold**, *italic*, or \`code\`
- Use plain text only - no asterisks, underscores, or backticks
- For emphasis, use natural language like "important" or "key point"
- For lists, use numbers or simple bullets without markdown
- Format responses like ChatGPT: natural, conversational, easy to read`;

// Get AI response from Gemini
const getAIResponse = async (message, context = "") => {
  try {
    console.log("🤖 getAIResponse called with message:", message);
    console.log("🔑 GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
    console.log(
      "🔑 API Key value:",
      process.env.GEMINI_API_KEY?.substring(0, 20) + "..."
    );

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      console.log("⚠️ GEMINI_API_KEY not configured, using fallback responses");
      return getFallbackResponse(message);
    }

    console.log("🚀 Calling Gemini API...");

    // Initialize Gemini AI with fresh instance each time
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Build prompt with context
    const fullPrompt = context
      ? `${SYSTEM_PROMPT}\n\nContext: ${context}\n\nStudent Question: ${message}`
      : `${SYSTEM_PROMPT}\n\nStudent Question: ${message}`;

    // Try a list of candidate models (in order). If one fails (404/503), fall back to the next.
    const candidateModels = [
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-001",
    ];

    console.log(
      "📝 Attempting to generate with candidate models:",
      candidateModels
    );

    let text = null;
    for (const modelName of candidateModels) {
      try {
        console.log(`🔁 Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        text = response.text();

        if (text) {
          console.log(
            `✅ Gemini response received from ${modelName}:`,
            text?.substring(0, 120) + "..."
          );
          break;
        }
      } catch (err) {
        // Log and try the next model
        console.warn(
          `⚠️ Model ${modelName} failed:`,
          err?.status || err?.message || err
        );
        // continue to next candidate
      }
    }

    return text || getFallbackResponse(message);
  } catch (error) {
    console.error("❌ Gemini AI Error:", error.message);
    console.error("❌ Error status:", error.status);
    console.error("❌ Full error:", error);
    return getFallbackResponse(message);
  }
};

// Fallback responses when AI is unavailable
const getFallbackResponse = (message) => {
  const msg = message.toLowerCase();

  // Science subjects
  if (msg.includes("science")) {
    return "Science is the study of the natural world through observation and experimentation. It includes Biology (study of living things), Chemistry (study of matter), and Physics (study of energy and forces). Which area interests you most?";
  }

  if (
    msg.includes("biology") ||
    msg.includes("cell") ||
    msg.includes("organ")
  ) {
    return "Biology studies living organisms! Topics include cells, genetics, ecology, human body systems, and evolution. What specific biology topic would you like to learn about?";
  }

  if (
    msg.includes("chemistry") ||
    msg.includes("atom") ||
    msg.includes("molecule")
  ) {
    return "Chemistry explores matter and its changes. Key topics: atoms, molecules, chemical reactions, acids & bases, and the periodic table. What chemistry concept shall we discuss?";
  }

  if (
    msg.includes("physics") ||
    msg.includes("force") ||
    msg.includes("energy")
  ) {
    return "Physics studies matter, energy, and their interactions. Topics include motion, forces, electricity, magnetism, and waves. Which physics topic interests you?";
  }

  if (
    msg.includes("math") ||
    msg.includes("equation") ||
    msg.includes("solve")
  ) {
    return "I can help with Mathematics! Topics include algebra, geometry, trigonometry, calculus, and statistics. What math problem are you working on?";
  }

  if (msg.includes("quadratic")) {
    return "To solve quadratic equations: 1) Factoring, 2) Completing the square, 3) Quadratic formula: x = [-b ± √(b²-4ac)] / 2a. Which method would you like explained?";
  }

  if (msg.includes("photosynthesis")) {
    return "Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Plants convert light energy to chemical energy in chloroplasts. Want to know about the light/dark reactions?";
  }

  if (msg.includes("newton") && msg.includes("law")) {
    return "Newton's Laws: 1st (Inertia) - Objects resist motion changes. 2nd - F = ma (Force = mass × acceleration). 3rd - Action-reaction pairs. Which law shall we explore?";
  }

  // Study help
  if (msg.includes("study") || msg.includes("exam") || msg.includes("test")) {
    return "Study tips: 1) Review notes daily, 2) Practice past papers, 3) Join study groups, 4) Use EduLink to ask questions, 5) Take breaks. Need help with a specific subject?";
  }

  if (msg.includes("homework") || msg.includes("assignment")) {
    return "I can guide you through homework! Post your question on EduLink with details about what you've tried. Our community and teachers will help you understand the solution step-by-step.";
  }

  // Platform help
  if (msg.includes("ask") || msg.includes("post") || msg.includes("question")) {
    return "To ask a question: Click 'Ask Question' → Write clear title → Add details → Select subject/topic → Attach images if needed. Your question will get answers from the community!";
  }

  if (
    msg.includes("answer") ||
    msg.includes("respond") ||
    msg.includes("reply")
  ) {
    return "To answer questions: Browse by subject → Click a question → Write helpful answer → Submit. Teachers can verify correct answers, and you earn reputation points!";
  }

  // Greetings
  if (
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("hey") ||
    msg.includes("greet")
  ) {
    return "Hello! I'm EduBot, your AI study assistant for EduLink Uganda! 📚 I can help with Biology, Chemistry, Physics, Mathematics, and guide you through the platform. What do you need help with today?";
  }

  if (msg.includes("thank") || msg.includes("thanks")) {
    return "You're welcome! Happy to help you learn. Feel free to ask more questions anytime! 😊";
  }

  if (msg.includes("help") || msg.includes("assist")) {
    return "I'm here to assist! I can: 1) Explain academic concepts (Biology, Chemistry, Physics, Math), 2) Guide you on using EduLink, 3) Suggest study strategies. What would you like help with?";
  }

  // Default response
  return "I can help with Biology, Chemistry, Physics, Mathematics, or guide you through EduLink. Ask me a specific question, or let me know what subject you're studying! 📖";
};

// Simple chatbot responses (can be replaced with OpenAI integration)
// Now integrated with Google Gemini AI - see getAIResponse() above

// @desc    Chat with bot
// @route   POST /api/chatbot
// @access  Private
export const chatWithBot = async (req, res, next) => {
  try {
    const { message, context } = req.body;

    console.log("📥 Chatbot request received:", { message, context });

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message",
      });
    }

    // Coerce message to string (defensive) and trim
    let userMessage =
      typeof message === "string" ? message.trim() : JSON.stringify(message);

    // Enforce max length to avoid Mongoose validation errors; truncate if necessary
    const MAX_MESSAGE_LENGTH = 1000;
    if (userMessage.length > MAX_MESSAGE_LENGTH) {
      // truncate and continue, but also inform in logs
      console.warn(
        "⚠️ User message too long, truncating to %d characters",
        MAX_MESSAGE_LENGTH
      );
      userMessage = userMessage.substring(0, MAX_MESSAGE_LENGTH);
    }

    // Get AI response from Gemini
    console.log("🔄 Getting AI response...");
    const botResponse = await getAIResponse(message, context);
    console.log("📤 Bot response:", botResponse);

    // Save user message (use coerced/truncated userMessage)
    await Chat.create({
      user: req.user.id,
      message: userMessage,
      role: "user",
      context,
    });

    // Save bot response: coerce and truncate the stored `message` to schema limit,
    // but keep the full AI text in `botResponse` field so nothing is lost.
    let botMessageForDB =
      typeof botResponse === "string"
        ? botResponse.trim()
        : JSON.stringify(botResponse);
    if (botMessageForDB.length > MAX_MESSAGE_LENGTH) {
      console.warn(
        "⚠️ Bot response too long, truncating stored message to %d characters",
        MAX_MESSAGE_LENGTH
      );
      const fullBotResponse = botMessageForDB;
      botMessageForDB = botMessageForDB.substring(0, MAX_MESSAGE_LENGTH);

      await Chat.create({
        user: req.user.id,
        message: botMessageForDB,
        role: "bot",
        context,
        botResponse: fullBotResponse,
      });
    } else {
      await Chat.create({
        user: req.user.id,
        message: botMessageForDB,
        role: "bot",
        context,
        botResponse: botMessageForDB,
      });
    }

    console.log("✅ Chat saved successfully");

    res.status(200).json({
      success: true,
      data: {
        userMessage: message,
        botResponse,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("❌ Chatbot error:", error);
    next(error);
  }
};

// @desc    Get chat history
// @route   GET /api/chatbot/history
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .sort({ createdAt: 1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark chat as helpful
// @route   PUT /api/chatbot/:id/helpful
// @access  Private
export const markHelpful = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.helpful = req.body.helpful;
    await chat.save();

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};
