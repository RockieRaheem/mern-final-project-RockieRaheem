import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import User from "../models/User.js";

// @desc    Get answers for a question
// @route   GET /api/answers/question/:questionId
// @access  Public
export const getAnswersForQuestion = async (req, res, next) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate("author", "name avatar role verified")
      .populate("verifiedBy", "name role")
      .sort({ isAccepted: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new answer
// @route   POST /api/answers
// @access  Private
export const createAnswer = async (req, res, next) => {
  try {
    const { question, body } = req.body;

    // Check if question exists
    const questionDoc = await Question.findById(question);
    if (!questionDoc) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Add author
    req.body.author = req.user.id;

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      req.body.attachments = req.files.map((file) => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
      }));
    }

    // Auto-approve for verified teachers
    if (req.user.role === "teacher" && req.user.verified) {
      req.body.status = "approved";
      req.body.verifiedBy = req.user.id;
      req.body.verifiedAt = Date.now();
    }

    const answer = await Answer.create(req.body);

    // Add answer to question
    questionDoc.answers.push(answer._id);
    if (questionDoc.status === "open") {
      questionDoc.status = "answered";
    }
    await questionDoc.save();

    // Award points to user
    const user = await User.findById(req.user.id);
    user.points += 5; // 5 points for answering
    await user.save();

    await answer.populate("author", "name avatar role verified");

    res.status(201).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on answer
// @route   PUT /api/answers/:id/vote
// @access  Private
export const voteAnswer = async (req, res, next) => {
  try {
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    const hasUpvoted = answer.upvotes.includes(req.user.id);
    const hasDownvoted = answer.downvotes.includes(req.user.id);

    if (voteType === "upvote") {
      if (hasUpvoted) {
        // Remove upvote
        answer.upvotes = answer.upvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      } else {
        // Add upvote, remove downvote if exists
        answer.upvotes.push(req.user.id);
        if (hasDownvoted) {
          answer.downvotes = answer.downvotes.filter(
            (id) => id.toString() !== req.user.id
          );
        }
      }
    } else if (voteType === "downvote") {
      if (hasDownvoted) {
        // Remove downvote
        answer.downvotes = answer.downvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      } else {
        // Add downvote, remove upvote if exists
        answer.downvotes.push(req.user.id);
        if (hasUpvoted) {
          answer.upvotes = answer.upvotes.filter(
            (id) => id.toString() !== req.user.id
          );
        }
      }
    }

    await answer.save();

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept answer (question author only)
// @route   PUT /api/answers/:id/accept
// @access  Private
export const acceptAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    const question = await Question.findById(answer.question);

    // Only question author can accept
    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the question author can accept an answer",
      });
    }

    // Unaccept all other answers for this question
    await Answer.updateMany(
      { question: answer.question },
      { isAccepted: false }
    );

    answer.isAccepted = true;
    await answer.save();

    // Award bonus points to answer author
    const answerAuthor = await User.findById(answer.author);
    answerAuthor.points += 15; // 15 bonus points for accepted answer
    await answerAuthor.save();

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify answer (teachers only)
// @route   PUT /api/answers/:id/verify
// @access  Private (Teachers/Admins only)
export const verifyAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    answer.status = "approved";
    answer.verifiedBy = req.user.id;
    answer.verifiedAt = Date.now();
    await answer.save();

    // Award points to answer author
    const answerAuthor = await User.findById(answer.author);
    answerAuthor.points += 10; // 10 points for verified answer
    await answerAuthor.save();

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private
export const deleteAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Only answer author or admin can delete
    if (answer.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this answer",
      });
    }

    // Remove answer from question
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id },
    });

    await answer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
