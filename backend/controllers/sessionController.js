import Session from "../models/Session.js";

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
export const getSessions = async (req, res, next) => {
  try {
    const { subject, educationLevel, type, status } = req.query;

    const query = {};
    if (subject) query.subject = subject;
    if (educationLevel) query.educationLevel = educationLevel;
    if (type) query.type = type;
    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate("host", "name avatar role verified")
      .sort({ startTime: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
export const getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("host", "name avatar role verified")
      .populate("participants.user", "name avatar");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create session
// @route   POST /api/sessions
// @access  Private (Teacher/Student)
export const createSession = async (req, res, next) => {
  try {
    req.body.host = req.user.id;

    const session = await Session.create(req.body);
    await session.populate("host", "name avatar role");

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join session
// @route   PUT /api/sessions/:id/join
// @access  Private
export const joinSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.status !== "live" && session.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot join this session. It may have ended or been cancelled.",
      });
    }

    await session.addParticipant(req.user.id);

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Host only)
export const updateSession = async (req, res, next) => {
  try {
    let session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this session",
      });
    }

    session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Host/Admin)
export const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.host.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this session",
      });
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
