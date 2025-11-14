import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import apiExports from "../api";

const MyQuestions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for filters
  const [filters, setFilters] = useState({
    subject: "All Subjects",
    timeAsked: "Any Time",
    status: "All Statuses",
  });

  // API integration states
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { questions: questionsAPI } = apiExports;

  // Helper: map backend question to UI format
  const mapQuestion = (q) => {
    // Status mapping
    let statusBgClass = "bg-info/10";
    let statusTextClass = "text-info";
    let statusIcon = "forum";
    if (q.status === "Verified") {
      statusBgClass = "bg-verified/10";
      statusTextClass = "text-verified";
      statusIcon = "verified";
    } else if (q.status === "Answered") {
      statusBgClass = "bg-success/10";
      statusTextClass = "text-success";
      statusIcon = "check_circle";
    } else if (q.status === "Pending") {
      statusBgClass = "bg-warning/10";
      statusTextClass = "text-warning";
      statusIcon = "pending";
    }
    // Time ago
    const timeAgo = q.createdAt ? timeAgoFormat(q.createdAt) : "";
    return {
      id: q._id,
      title: q.title,
      description: q.description,
      subject: q.subject,
      status: q.status,
      statusBgClass,
      statusTextClass,
      statusIcon,
      timeAgo,
      askedBy: q.askedBy?.name || "You",
    };
  };

  // Helper: time ago formatting
  function timeAgoFormat(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `${diffMins} min ago`;
      }
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${
        Math.floor(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    if (diffDays < 90)
      return `${Math.floor(diffDays / 30)} month${
        Math.floor(diffDays / 30) > 1 ? "s" : ""
      } ago`;
    return date.toLocaleDateString();
  }

  // Fetch questions from API
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Map filters to query params
      const params = {};
      if (filters.subject && filters.subject !== "All Subjects")
        params.subject = filters.subject;
      if (filters.status && filters.status !== "All Statuses")
        params.status = filters.status;
      // Time filter mapping
      if (filters.timeAsked && filters.timeAsked !== "Any Time") {
        const now = new Date();
        let fromDate;
        if (filters.timeAsked === "Last 7 days") {
          fromDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        } else if (filters.timeAsked === "Last 30 days") {
          fromDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        } else if (filters.timeAsked === "Last 3 months") {
          fromDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
        }
        if (fromDate) params.fromDate = fromDate.toISOString();
      }
      // Only fetch user's questions
      params.askedBy = user?._id;
      const res = await questionsAPI.getAll(params);
      setQuestions(res.data.data.map(mapQuestion));
    } catch (err) {
      setError(err.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    if (user) fetchQuestions();
    // eslint-disable-next-line
  }, [user, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    // Triggers useEffect to refetch
    setFilters({ ...filters });
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/questions/${questionId}`);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="flex h-screen w-full flex-col">
        {/* Header */}
        <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Uganda Flag */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-black"></div>
              <div className="w-4 h-3 bg-yellow-400"></div>
              <div className="w-4 h-3 bg-red-600"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold">My Questions</h1>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Track and manage all your academic inquiries.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark transition-colors">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
            <img
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover"
              src={
                user?.avatar ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAHiyrU29vWFdRfu2THrcdJ9DuKRRigHZrZRRCZ3Fx63sDxfTh59DohoXuNttkTkkktAskwGwRrOKu7bxrTXYSDbHLcgAmQNsF1-DmcRd1Ha1os3y_9HuUUMuqm0zW-1MgF0zMKUlGh2b7D7sgKlz78N38_IBZ54M_XuDZRZBhJ1gii5g8ZcacgtIIzLl8B7LXqR9qYlx1OdtccUrD1umJkHPMYL7DkYJj0xUH-36_UlYjTI8diSWSOjcJ1gls00KWeMJqqMaMm8fE"
              }
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-6">
              {/* Filter Section */}
              <div className="p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Subject Filter */}
                  <div>
                    <label
                      className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1"
                      htmlFor="subject-filter"
                    >
                      Subject
                    </label>
                    <select
                      className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus:border-primary focus:ring-primary/50 text-text-light-primary dark:text-text-dark-primary"
                      id="subject-filter"
                      value={filters.subject}
                      onChange={(e) =>
                        handleFilterChange("subject", e.target.value)
                      }
                    >
                      <option>All Subjects</option>
                      <option>Physics</option>
                      <option>Mathematics</option>
                      <option>Chemistry</option>
                      <option>Biology</option>
                    </select>
                  </div>

                  {/* Time Filter */}
                  <div>
                    <label
                      className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1"
                      htmlFor="time-filter"
                    >
                      Time Asked
                    </label>
                    <select
                      className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus:border-primary focus:ring-primary/50 text-text-light-primary dark:text-text-dark-primary"
                      id="time-filter"
                      value={filters.timeAsked}
                      onChange={(e) =>
                        handleFilterChange("timeAsked", e.target.value)
                      }
                    >
                      <option>Any Time</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label
                      className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1"
                      htmlFor="status-filter"
                    >
                      Status
                    </label>
                    <select
                      className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus:border-primary focus:ring-primary/50 text-text-light-primary dark:text-text-dark-primary"
                      id="status-filter"
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option>All Statuses</option>
                      <option>Answered</option>
                      <option>In Discussion</option>
                      <option>Pending</option>
                      <option>Verified</option>
                    </select>
                  </div>

                  {/* Apply Button */}
                  <div className="flex items-end">
                    <button
                      onClick={applyFilters}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">
                        filter_alt
                      </span>
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8 text-lg text-text-light-secondary dark:text-text-dark-secondary">
                    Loading questions...
                  </div>
                )}
                {error && (
                  <div className="text-center py-8 text-lg text-red-500">
                    {error}
                  </div>
                )}
                {!loading && !error && questions.length === 0 && (
                  <div className="text-center py-8 text-lg text-text-light-secondary dark:text-text-dark-secondary">
                    No questions found.
                  </div>
                )}
                {!loading &&
                  !error &&
                  questions.map((question) => (
                    <div
                      key={question.id}
                      onClick={() => handleQuestionClick(question.id)}
                      className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 transition-shadow hover:shadow-md cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {/* Status Badge */}
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full ${question.statusBgClass} px-2 py-0.5 text-xs font-medium ${question.statusTextClass}`}
                            >
                              <span className="material-symbols-outlined text-sm filled">
                                {question.statusIcon}
                              </span>
                              {question.status}
                            </span>
                            <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                              •
                            </span>
                            <span className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                              {question.subject}
                            </span>
                          </div>
                          <p className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">
                            {question.title}
                          </p>
                          <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                            {question.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-left sm:text-right">
                          <p className="text-sm font-medium">
                            Asked {question.timeAgo}
                          </p>
                          <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                            by {question.askedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Footer */}
              <div className="flex justify-center pt-4">
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                  For God and My Country
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Floating Chatbot Button */}
        <button className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark">
          <span className="material-symbols-outlined text-4xl">smart_toy</span>
        </button>
      </div>
    </div>
  );
};

export default MyQuestions;
