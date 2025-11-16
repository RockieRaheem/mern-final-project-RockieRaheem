import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Questions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: "",
    educationLevel: "",
    status: "",
    search: "",
  });

  const subjects = [
    "Biology",
    "Chemistry",
    "Physics",
    "Mathematics",
    "English",
    "History",
    "Geography",
    "Economics",
  ];

  const educationLevels = ["O-Level", "A-Level"];

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.questions.getAll(filters);
      const data = response.data?.data || response.data || [];
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch questions", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      educationLevel: "",
      status: "",
      search: "",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "answered":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "closed":
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
                Questions & Answers
              </h1>
              <p className="text-text-light-secondary dark:text-text-dark-secondary">
                Browse and answer questions from the community
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined">add</span>
              Ask Question
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-text-light-primary dark:text-text-dark-primary">
                Search
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-light-secondary">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-text-light-primary dark:text-text-dark-primary">
                Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-text-light-primary dark:text-text-dark-primary">
                Level
              </label>
              <select
                value={filters.educationLevel}
                onChange={(e) =>
                  handleFilterChange("educationLevel", e.target.value)
                }
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">All Levels</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.subject ||
            filters.educationLevel ||
            filters.search ||
            filters.status) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                <span className="material-symbols-outlined text-lg">close</span>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <div className="text-text-light-secondary dark:text-text-dark-secondary">
                Loading questions...
              </div>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-card-light dark:bg-card-dark rounded-2xl p-12 text-center border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4 opacity-50">
              help_outline
            </span>
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-lg mb-4">
              No questions found
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Ask the First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question._id}
                onClick={() => navigate(`/questions/${question._id}`)}
                className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                        <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">
                          thumb_up
                        </span>
                        <span className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">
                          {Array.isArray(question.upvotes)
                            ? question.upvotes.length
                            : question.upvotes || 0}
                        </span>
                      </div>
                      <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                        <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">
                          chat_bubble
                        </span>
                        <span className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">
                          {Array.isArray(question.answers)
                            ? question.answers.length
                            : 0}
                        </span>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary hover:text-primary transition-colors">
                          {question.title}
                        </h3>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${getStatusColor(
                            question.status
                          )}`}
                        >
                          {question.status?.toUpperCase() || "OPEN"}
                        </span>
                      </div>

                      <p className="text-text-light-secondary dark:text-text-dark-secondary line-clamp-2 mb-4">
                        {question.body}
                      </p>

                      {/* Attachments Indicator */}
                      {question.attachments &&
                        question.attachments.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-primary text-sm">
                              attach_file
                            </span>
                            <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                              {question.attachments.length}{" "}
                              {question.attachments.length === 1
                                ? "attachment"
                                : "attachments"}
                            </span>
                          </div>
                        )}

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              question.author?.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                question.author?.name || "User"
                              )}&background=6366f1&color=fff`
                            }
                            alt={question.author?.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                            {question.author?.name || "Anonymous"}
                          </span>
                          {question.author?.verified && (
                            <span
                              className="material-symbols-outlined text-blue-500 text-sm"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                          {question.subject}
                        </span>

                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300">
                          {question.educationLevel}
                        </span>

                        <div className="flex items-center gap-1 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          <span className="material-symbols-outlined text-sm">
                            visibility
                          </span>
                          <span>{question.views || 0}</span>
                        </div>

                        <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          {new Date(question.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      {/* Tags */}
                      {question.tags && question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {question.tags.slice(0, 5).map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
