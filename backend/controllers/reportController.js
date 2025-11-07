import Report from "../models/Report.js";
import User from "../models/User.js";

// @desc    Create report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    req.body.reporter = req.user.id;

    const report = await Report.create(req.body);

    res.status(201).json({
      success: true,
      data: report,
      message:
        "Report submitted successfully. Our team will review it shortly.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private (Admin/Teacher)
export const getReports = async (req, res, next) => {
  try {
    const { status, type, priority } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const reports = await Report.find(query)
      .populate("reporter", "name email")
      .populate("reportedUser", "name email")
      .populate("reviewedBy", "name")
      .sort({ priority: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report (review)
// @route   PUT /api/reports/:id
// @access  Private (Admin only)
export const updateReport = async (req, res, next) => {
  try {
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    req.body.reviewedBy = req.user.id;
    req.body.reviewedAt = Date.now();

    report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If action is to suspend or ban user
    if (
      req.body.action === "user-suspended" ||
      req.body.action === "user-banned"
    ) {
      const user = await User.findById(report.reportedUser);
      if (user) {
        if (req.body.action === "user-suspended") {
          user.status = "suspended";
          user.strikes += 1;
        } else {
          user.status = "banned";
        }
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};
