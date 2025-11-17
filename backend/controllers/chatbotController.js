import Chat from "../models/Chat.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// System prompt for educational context
const SYSTEM_PROMPT = `You are EduBot, an AI tutor for EduLink Uganda - a platform for O-Level and A-Level students.
Your role is to:
- Assist with Biology, Chemistry, Physics, Mathematics, English, History, Geography, and Economics.
- Explain concepts clearly and concisely for Ugandan secondary school students.
- Provide step-by-step solutions for academic problems and illustrative examples when helpful.
- Guide students on using the EduLink platform features.

IMPORTANT FORMATTING RULES:
- Use clear, professional, and neutral language appropriate for students and educators.
- Keep responses concise (preferably under 250 words) and use simple vocabulary suitable for the target audience.
- Avoid markdown formatting (do not use bold, italics, asterisks, underscores, backticks, or other markup) and avoid emojis.
- Use plain text only; for emphasis prefer natural language such as "important" or "key point".
- When answering multi-step problems, number steps or use short paragraphs for clarity.
- For lists, use numbered steps or simple bullets (rendered as plain text) rather than markdown list syntax.
- Format responses in a natural, conversational, easy-to-read style similar to professional tutoring assistants.`;

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

    // Format context for prompt: the frontend sends an array of messages
    // like [{ role: 'user'|'assistant', content: '...'}]. Convert that into
    // a readable transcript so the model can use it as conversational memory.
    let contextText = "";
    if (context) {
      if (Array.isArray(context)) {
        contextText = context
          .map((m) => {
            const who = m.role === "assistant" ? "Assistant" : "User";
            return `${who}: ${m.content}`;
          })
          .join("\n");
      } else if (typeof context === "object") {
        // If a single object was passed, stringify useful fields
        contextText = Object.entries(context)
          .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
          .join("\n");
      } else {
        contextText = String(context);
      }
    }

    const fullPrompt = contextText
      ? `${SYSTEM_PROMPT}\n\nConversation history:\n${contextText}\n\nStudent Question: ${message}`
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
    return "Science is the study of the natural world through observation and experimentation. It includes Biology (the study of living organisms), Chemistry (the study of matter and its changes), and Physics (the study of energy and forces). Which area would you like to explore?";
  }

  if (
    msg.includes("biology") ||
    msg.includes("cell") ||
    msg.includes("organ")
  ) {
    return "Biology is the study of living organisms. Common topics include cells, genetics, ecology, human body systems, and evolution. Which biology topic would you like to learn about?";
  }

  // Protein synthesis / transcription & translation
  if (
    msg.includes("protein") ||
    msg.includes("protein synthesis") ||
    msg.includes("transcription") ||
    msg.includes("translation")
  ) {
    return (
      "Protein synthesis is the process by which cells produce proteins from genetic information. " +
      "It occurs in two main stages:\n\n" +
      "1. Transcription:\n" +
      "   The cell copies the relevant section of DNA into messenger RNA (mRNA) inside the nucleus. " +
      "The mRNA carries the genetic instructions out of the nucleus to the cytoplasm.\n\n" +
      "2. Translation:\n" +
      "   Ribosomes read the mRNA in groups of three bases (codons). Transfer RNA (tRNA) brings the matching amino acids to the ribosome, which links them together to form a polypeptide chain.\n\n" +
      "After the chain is formed, it folds into its functional three-dimensional shape. The overall flow is: DNA → mRNA → protein. " +
      "Would you like a more detailed explanation of any of these steps?"
    );
  }

  if (
    msg.includes("chemistry") ||
    msg.includes("atom") ||
    msg.includes("molecule")
  ) {
    return "Chemistry explores matter and its changes. Key topics include atoms, molecules, chemical reactions, acids and bases, and the periodic table. Which chemistry concept would you like to discuss?";
  }

  if (
    msg.includes("physics") ||
    msg.includes("force") ||
    msg.includes("energy")
  ) {
    return "Physics studies matter, energy, and their interactions. Topics include motion, forces, electricity, magnetism, and waves. Which physics topic would you like to study?";
  }

  if (
    msg.includes("math") ||
    msg.includes("equation") ||
    msg.includes("solve")
  ) {
    return "I can help with Mathematics. Topics include algebra, geometry, trigonometry, calculus, and statistics. What math problem or topic are you working on?";
  }

  if (msg.includes("quadratic")) {
    return "To solve quadratic equations you can use: 1) Factoring, 2) Completing the square, or 3) the quadratic formula x = [-b ± √(b² - 4ac)] / (2a). Which method would you like explained?";
  }

  if (msg.includes("photosynthesis")) {
    return "Photosynthesis is the process by which plants convert light energy into chemical energy. The simplified equation is: 6 CO₂ + 6 H₂O + light → C₆H₁₂O₆ + 6 O₂. Would you like an explanation of the light-dependent and light-independent reactions?";
  }

  if (msg.includes("newton") && msg.includes("law")) {
    return "Newton's Laws of Motion are: 1) Law of Inertia, 2) F = ma (force equals mass times acceleration), and 3) action-reaction pairs. Which law would you like to explore in more detail?";
  }

  // Study help
  if (msg.includes("study") || msg.includes("exam") || msg.includes("test")) {
    return "Study tips: 1) Review your notes regularly, 2) Practice past examination papers, 3) Join a study group, 4) Use EduLink to ask specific questions, and 5) take regular short breaks. Do you need help with a particular subject?";
  }

  if (msg.includes("homework") || msg.includes("assignment")) {
    return "I can guide you through homework. Please post your question on EduLink with details of what you have tried so far. Teachers and the community can then help you understand the solution step by step.";
  }

  // Platform help
  if (msg.includes("ask") || msg.includes("post") || msg.includes("question")) {
    return "To ask a question on EduLink: click 'Ask Question', write a clear title, add full details, select the relevant subject or topic, and attach images if needed. This helps the community provide useful answers.";
  }

  if (
    msg.includes("answer") ||
    msg.includes("respond") ||
    msg.includes("reply")
  ) {
    return "To answer questions: browse by subject, select a question, write a clear and helpful answer, then submit. Teachers may verify answers and you may earn reputation for useful contributions.";
  }

  // Greetings
  if (
    msg.includes("hello") ||
    msg.includes("hi") ||
    msg.includes("hey") ||
    msg.includes("greet")
  ) {
    return "Hello. I am EduBot, the EduLink Uganda study assistant. I can assist with Biology, Chemistry, Physics, Mathematics, and provide guidance on using the platform. How may I assist you today?";
  }

  if (msg.includes("thank") || msg.includes("thanks")) {
    return "You are welcome. I am glad to help. Please feel free to ask further questions if you need more assistance.";
  }

  if (msg.includes("help") || msg.includes("assist")) {
    return "I am here to assist. I can: 1) explain academic concepts (Biology, Chemistry, Physics, Mathematics), 2) guide you on using EduLink, and 3) suggest study strategies. What would you like help with?";
  }

  // Default response
  return "I can help with Biology, Chemistry, Physics, Mathematics, or provide guidance on using EduLink. Please ask a specific question or tell me which subject you are studying.";
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
