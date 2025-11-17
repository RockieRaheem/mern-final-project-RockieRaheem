// import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api";

export default function Sessions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activeFilter, setActiveFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Session Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    subject: "",
    educationLevel: "",
    type: "teacher-led",
    startTime: "",
    duration: 60,
    maxParticipants: 20,
    topic: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.sessions.getAll();
      setSessions(response.data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    // Status filter
    if (activeFilter !== "all") {
      if (activeFilter === "live" && session.status !== "live") return false;
      if (activeFilter === "scheduled" && session.status !== "scheduled")
        return false;
      if (activeFilter === "ended" && session.status !== "ended") return false;
    }

    // Subject filter
    if (subjectFilter && session.subject !== subjectFilter) return false;

    // Level filter
    if (levelFilter && session.educationLevel !== levelFilter) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = session.title?.toLowerCase().includes(query);
      const matchesDescription = session.description
        ?.toLowerCase()
        .includes(query);
      const matchesHost = session.host?.name?.toLowerCase().includes(query);
      const matchesSubject = session.subject?.toLowerCase().includes(query);

      if (
        !matchesTitle &&
        !matchesDescription &&
        !matchesHost &&
        !matchesSubject
      ) {
        return false;
      }
    }

    return true;
  });

  const handleJoinSession = (sessionId) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      await api.sessions.create(createForm);
      setShowCreateModal(false);
      setCreateForm({
        title: "",
        description: "",
        subject: "",
        educationLevel: "",
        type: "teacher-led",
        startTime: "",
        duration: 60,
        maxParticipants: 20,
        topic: "",
      });
      await fetchSessions();
    } catch (err) {
      console.error("Session creation error:", err);
      setCreateError(
        err.response?.data?.message || err.message || "Failed to create session"
      );
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300";
      case "ended":
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300";
    }
  };

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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
              Study Sessions
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              Join live study sessions or create your own group study
            </p>
          </div>

          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 lg:mt-0 inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <span className="material-symbols-outlined mr-2">add_circle</span>
              Create Session
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                Status
              </label>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All Sessions" },
                  { value: "live", label: "Live Now" },
                  { value: "scheduled", label: "Upcoming" },
                  { value: "ended", label: "Past" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeFilter === filter.value
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                Subject
              </label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                Level
              </label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="">All Levels</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                Search
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sessions..."
                  className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark animate-pulse"
              >
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-red-500 mb-4">
              error
            </span>
            <h3 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary mb-2">
              Failed to Load Sessions
            </h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mb-4">
              {error}
            </p>
            <button
              onClick={fetchSessions}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="bg-card-light dark:bg-card-dark rounded-lg border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          session.status
                        )}`}
                      >
                        {session.status.charAt(0).toUpperCase() +
                          session.status.slice(1)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary rounded-full text-xs font-medium">
                        {session.subject}
                      </span>
                    </div>
                    {session.status === "live" && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary mb-2 line-clamp-2">
                    {session.title}
                  </h3>

                  {session.description && (
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2 mb-4">
                      {session.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        session.host?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          session.host?.name || "Host"
                        )}`
                      }
                      alt={session.host?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary">
                        {session.host?.name || "Host"}
                      </p>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        {session.host?.role === "teacher"
                          ? "Teacher"
                          : "Student"}
                        {session.host?.verified && (
                          <span className="ml-1 inline-flex items-center">
                            <span className="material-symbols-outlined text-green-600 text-xs">
                              verified
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <span className="material-symbols-outlined text-base">
                        calendar_today
                      </span>
                      <span>
                        {formatDate(session.startTime)} at{" "}
                        {formatTime(session.startTime)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <span className="material-symbols-outlined text-base">
                        timer
                      </span>
                      <span>{session.duration || 60} minutes</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <span className="material-symbols-outlined text-base">
                        group
                      </span>
                      <span>
                        {session.participants?.length || 0} /{" "}
                        {session.maxParticipants || 50} participants
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleJoinSession(session._id)}
                    disabled={
                      session.status === "ended" ||
                      session.status === "cancelled"
                    }
                    className={`w-full flex items-center justify-center rounded-lg h-11 px-4 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      session.status === "live"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : session.status === "ended" ||
                          session.status === "cancelled"
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    <span className="material-symbols-outlined mr-2 text-lg">
                      {session.status === "live"
                        ? "play_circle"
                        : session.status === "ended" ||
                          session.status === "cancelled"
                        ? "check_circle"
                        : "event"}
                    </span>
                    <span>
                      {session.status === "live"
                        ? "Join Live Session"
                        : session.status === "ended"
                        ? "Session Ended"
                        : session.status === "cancelled"
                        ? "Session Cancelled"
                        : "View Details"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-text-light-secondary dark:text-text-dark-secondary mb-4">
              event_busy
            </span>
            <h3 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary mb-2">
              No Sessions Found
            </h3>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
              {searchQuery || subjectFilter || levelFilter
                ? "Try adjusting your filters or search terms."
                : "No study sessions available at the moment."}
            </p>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <span className="material-symbols-outlined mr-2">
                  add_circle
                </span>
                Create First Session
              </button>
            )}
          </div>
        )}

        {/* Create Session Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
                  Create Study Session
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {createError && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30 rounded-lg">
                  <p className="text-red-800 dark:text-red-300 text-sm">
                    {createError}
                  </p>
                </div>
              )}

              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={createForm.title}
                    onChange={handleCreateChange}
                    placeholder="e.g., Biology Revision Session"
                    required
                    className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateChange}
                    placeholder="Describe what you'll cover in this session..."
                    rows={3}
                    className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={createForm.subject}
                      onChange={handleCreateChange}
                      required
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                      Level *
                    </label>
                    <select
                      name="educationLevel"
                      value={createForm.educationLevel}
                      onChange={handleCreateChange}
                      required
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="">Select Level</option>
                      {educationLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                    Session Type
                  </label>
                  <select
                    name="type"
                    value={createForm.type}
                    onChange={handleCreateChange}
                    className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="teacher-led">Teacher Led</option>
                    <option value="student-led">Student Led</option>
                    <option value="group-study">Group Study</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      value={createForm.startTime}
                      onChange={handleCreateChange}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={createForm.duration}
                      onChange={handleCreateChange}
                      min={15}
                      max={180}
                      required
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={createForm.maxParticipants}
                      onChange={handleCreateChange}
                      min={2}
                      max={100}
                      required
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light-primary dark:text-text-dark-primary mb-2">
                      Topic (Optional)
                    </label>
                    <input
                      type="text"
                      name="topic"
                      value={createForm.topic}
                      onChange={handleCreateChange}
                      placeholder="e.g., Photosynthesis"
                      className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Session"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
