// Content moderation middleware
const bannedWords = [
  "badword1",
  "badword2", // Add actual banned words
];

const suspiciousPatterns = [
  /\b\d{10,}\b/g, // Phone numbers
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email addresses
  /(?:https?:\/\/)?(?:www\.)?[\w\-]+\.[\w\-]+/gi, // URLs
];

export const moderateContent = (req, res, next) => {
  const contentFields = ["body", "message", "title", "description"];
  let content = "";

  // Extract content from request body
  contentFields.forEach((field) => {
    if (req.body[field]) {
      content += " " + req.body[field].toLowerCase();
    }
  });

  if (!content.trim()) {
    return next();
  }

  // Check for banned words
  const hasBannedWords = bannedWords.some((word) =>
    content.includes(word.toLowerCase())
  );

  if (hasBannedWords) {
    return res.status(400).json({
      success: false,
      message:
        "Your content contains inappropriate language. Please revise and try again.",
      flagged: true,
    });
  }

  // Check for suspicious patterns
  const hasSuspiciousContent = suspiciousPatterns.some((pattern) =>
    pattern.test(content)
  );

  if (hasSuspiciousContent) {
    // Flag but allow - will be reviewed by moderators
    req.flagged = true;
    req.flagReason = "Contains personal information or external links";
  }

  next();
};

// Rate limiting for specific actions
export const actionLimiter = (maxActions, timeWindow) => {
  const actions = new Map();

  return (req, res, next) => {
    const userId = req.user.id;
    const now = Date.now();
    const userActions = actions.get(userId) || [];

    // Filter out old actions
    const recentActions = userActions.filter((time) => now - time < timeWindow);

    if (recentActions.length >= maxActions) {
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please wait before trying again.`,
      });
    }

    recentActions.push(now);
    actions.set(userId, recentActions);

    next();
  };
};

// Strike system middleware
export const checkStrikes = async (req, res, next) => {
  if (req.user.strikes >= 3) {
    req.user.status = "suspended";
    await req.user.save();

    return res.status(403).json({
      success: false,
      message:
        "Your account has been suspended due to multiple violations. Contact admin for appeal.",
    });
  }

  next();
};
