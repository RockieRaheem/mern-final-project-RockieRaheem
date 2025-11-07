import Chat from "../models/Chat.js";

// Simple chatbot responses (can be replaced with OpenAI integration)
const getSimpleBotResponse = (message, context) => {
  const msg = message.toLowerCase();

  // Academic help responses
  if (msg.includes("quadratic") || msg.includes("equation")) {
    return "To solve quadratic equations, you can use: 1) Factoring, 2) Completing the square, 3) The quadratic formula: x = [-b ± √(b²-4ac)] / 2a. Would you like me to explain any of these methods?";
  }

  if (msg.includes("photosynthesis")) {
    return "Photosynthesis is the process by which plants convert light energy into chemical energy. The equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Would you like to know more about the light-dependent or light-independent reactions?";
  }

  if (msg.includes("newton") && msg.includes("law")) {
    return "Newton's Laws of Motion are: 1st Law (Inertia) - An object remains at rest or in uniform motion unless acted upon by a force. 2nd Law - F = ma. 3rd Law - For every action, there's an equal and opposite reaction. Which law would you like to explore?";
  }

  // Platform guidance
  if (msg.includes("ask") || msg.includes("post") || msg.includes("question")) {
    return "To ask a question: 1) Click 'Ask Question' button, 2) Write a clear title, 3) Provide detailed information, 4) Select the subject and topic, 5) Optionally attach an image. Your question will be visible to the community!";
  }

  if (msg.includes("answer") || msg.includes("respond")) {
    return "To answer a question: 1) Browse questions in your subject, 2) Click on a question to read it fully, 3) Write a clear, helpful answer, 4) Submit it for review. Teachers can verify your answer!";
  }

  if (msg.includes("session") || msg.includes("live")) {
    return "Live sessions allow you to study with teachers and peers in real-time! Check the 'Study Sessions' page to see upcoming sessions or create your own study group.";
  }

  // Default responses
  const greetings = ["hello", "hi", "hey", "greetings"];
  if (greetings.some((g) => msg.includes(g))) {
    return "Hello! I'm EduBot, your learning assistant. I can help with Biology, Chemistry, Physics, and Mathematics questions, or guide you through using EduLink. What would you like help with?";
  }

  return "I'm here to help! You can ask me about Biology, Chemistry, Physics, Mathematics, or how to use EduLink platform. Try asking a specific question or let me know what subject you need help with.";
};

// @desc    Chat with bot
// @route   POST /api/chatbot
// @access  Private
export const chatWithBot = async (req, res, next) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message",
      });
    }

    // Get bot response
    const botResponse = getSimpleBotResponse(message, context);

    // Save chat history
    const chat = await Chat.create({
      user: req.user.id,
      message,
      role: "user",
      context,
      botResponse,
    });

    // Save bot response
    await Chat.create({
      user: req.user.id,
      message: botResponse,
      role: "bot",
      context,
    });

    res.status(200).json({
      success: true,
      data: {
        userMessage: message,
        botResponse,
        timestamp: new Date(),
      },
    });
  } catch (error) {
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
