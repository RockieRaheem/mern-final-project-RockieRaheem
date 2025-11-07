import Question from "../models/Question.js";
import Answer from "../models/Answer.js";

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
export const getQuestions = async (req, res, next) => {
  try {
    const {
      subject,
      educationLevel,
      status,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = {};

    if (subject) query.subject = subject;
    if (educationLevel) query.educationLevel = educationLevel;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const questions = await Question.find(query)
      .populate("author", "name avatar school educationLevel")
      .populate({
        path: "answers",
        select: "author status createdAt",
        populate: { path: "author", select: "name avatar" },
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const count = await Question.countDocuments(query);

    res.status(200).json({
      success: true,
      count: questions.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
export const getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name avatar school educationLevel role verified")
      .populate({
        path: "answers",
        populate: [
          { path: "author", select: "name avatar role verified" },
          { path: "verifiedBy", select: "name role" },
        ],
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Increment views
    await question.incrementViews();

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
export const createQuestion = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.author = req.user.id;

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      req.body.attachments = req.files.map((file) => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
      }));
    }

    // Check if flagged by moderation middleware
    if (req.flagged) {
      req.body.flagged = true;
      req.body.flagReason = req.flagReason;
    }

    const question = await Question.create(req.body);

    // Populate author before sending
    await question.populate("author", "name avatar school");

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
export const updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Make sure user is question owner
    if (
      question.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this question",
      });
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Make sure user is question owner or admin
    if (
      question.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this question",
      });
    }

    // Delete all answers associated with this question
    await Answer.deleteMany({ question: req.params.id });

    await question.deleteOne();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote question
// @route   PUT /api/questions/:id/upvote
// @access  Private
export const upvoteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if user already upvoted
    const alreadyUpvoted = question.upvotes.includes(req.user.id);

    if (alreadyUpvoted) {
      // Remove upvote
      question.upvotes = question.upvotes.filter(
        (id) => id.toString() !== req.user.id
      );
    } else {
      // Add upvote
      question.upvotes.push(req.user.id);
    }

    await question.save();

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's questions
// @route   GET /api/questions/user/:userId
// @access  Public
export const getUserQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find({ author: req.params.userId })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};
