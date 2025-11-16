// import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Sessions() {
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const filter = "upcoming"; // upcoming, ongoing, past

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
    tags: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.sessions.getAll();
      setSessions(Array.isArray(response.data) ? response.data : []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = Array.isArray(sessions)
    ? sessions.filter((session) => {
        if (filter === "ongoing") return session.status === "active";
        if (filter === "past") return session.status === "completed";
        return session.status === "scheduled";
      })
    : [];

  const handleJoinSession = (sessionId) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    const allowedSubjects = [
      "Biology",
      "Chemistry",
      "Physics",
      "Mathematics",
      "English",
      "History",
      "Geography",
      "Economics",
    ];
    const allowedEducationLevels = ["O-Level", "A-Level"];
    const allowedTypes = ["student-led", "teacher-led", "group-study"];
    const payload = {
      ...createForm,
      subject: allowedSubjects.includes(createForm.subject)
        ? createForm.subject
        : allowedSubjects[0],
      educationLevel: allowedEducationLevels.includes(createForm.educationLevel)
        ? createForm.educationLevel
        : allowedEducationLevels[0],
      type: allowedTypes.includes(createForm.type)
        ? createForm.type
        : allowedTypes[1],
      tags: createForm.tags
        ? createForm.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };
    try {
      const response = await api.sessions.create(payload);
      if (response.data) {
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
          tags: "",
        });
        await fetchSessions();
      }
    } catch (err) {
      console.error("Session creation error:", err);
      if (err?.response?.data?.message) {
        setCreateError(err.response.data.message);
      } else if (err?.response?.data?.error) {
        setCreateError(err.response.data.error);
      }
    }
    await fetchSessions();
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed h-screen w-64 bg-card-light dark:bg-card-dark p-6 shadow-sm hidden lg:flex flex-col overflow-y-auto">
        <div className="flex flex-col h-full">
          <button
            className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 w-full md:w-auto"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="material-symbols-outlined mr-2">add_circle</span>
            <span>Create Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-text-light-secondary dark:text-text-dark-secondary">
              Loading sessions...
            </div>
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden hover:border-primary/50 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                      {session.subject}
                    </span>
                    {session.status === "active" && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
                    {session.title}
                  </h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary line-clamp-2 mb-4">
                    {session.description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <img
                      src={
                        session.host?.avatar ||
                        `https://ui-avatars.com/api/?name=${
                          session.host?.name || "Host"
                        }`
                      }
                      alt={session.host?.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">
                        {session.host?.name || "Host"}
                      </p>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        {session.host?.role === "Teacher"
                          ? "Teacher"
                          : "Student"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <span className="material-symbols-outlined text-base">
                        schedule
                      </span>
                      <span>
                        {new Date(
                          session.scheduledStart ||
                            session.startTime ||
                            session.createdAt
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <span className="material-symbols-outlined text-base">
                        timer
                      </span>
                      <span>{session.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <span className="material-symbols-outlined text-base">
                        group
                      </span>
                      <span>
                        {session.participants?.length || 0} /{" "}
                        {session.maxParticipants}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleJoinSession(session._id)}
                    disabled={session.status === "completed"}
                    className={`w-full flex items-center justify-center rounded-lg h-11 px-4 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      session.status === "active"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : session.status === "completed"
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    <span className="material-symbols-outlined mr-2 text-xl">
                      {session.status === "active"
                        ? "play_circle"
                        : session.status === "completed"
                        ? "check_circle"
                        : "event"}
                    </span>
                    <span>
                      {session.status === "active"
                        ? "Join Now"
                        : session.status === "completed"
                        ? "Ended"
                        : "Register"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card-light dark:bg-card-dark p-12 rounded-xl text-center border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-5xl text-text-light-secondary dark:text-text-dark-secondary mb-3">
              event_busy
            </span>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              No {filter} sessions at the moment.
            </p>
          </div>
        )}

        {/* Create Session Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <form
              className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-8 w-full max-w-lg flex flex-col gap-4"
              onSubmit={handleCreateSession}
            >
              <h2 className="text-2xl font-bold mb-2">Create New Session</h2>
              {createError && (
                <div className="text-danger text-sm mb-2">{createError}</div>
              )}
              <input
                type="text"
                name="title"
                value={createForm.title}
                onChange={handleCreateChange}
                placeholder="Session Title"
                required
                className="border rounded-lg px-4 py-2"
              />
              <textarea
                name="description"
                value={createForm.description}
                onChange={handleCreateChange}
                placeholder="Description"
                required
                className="border rounded-lg px-4 py-2"
              />
              <select
                name="subject"
                value={createForm.subject}
                onChange={handleCreateChange}
                required
                className="border rounded-lg px-4 py-2"
              >
                <option value="">Select Subject</option>
                <option value="Biology">Biology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Economics">Economics</option>
              </select>
              <select
                name="educationLevel"
                value={createForm.educationLevel}
                onChange={handleCreateChange}
                required
                className="border rounded-lg px-4 py-2"
              >
                <option value="">Select Education Level</option>
                <option value="O-Level">O-Level</option>
                <option value="A-Level">A-Level</option>
              </select>
              <select
                name="type"
                value={createForm.type}
                onChange={handleCreateChange}
                className="border rounded-lg px-4 py-2"
              >
                <option value="teacher-led">Teacher Led</option>
                <option value="student-led">Student Led</option>
                <option value="group-study">Group Study</option>
              </select>
              <input
                type="datetime-local"
                name="startTime"
                value={createForm.startTime}
                onChange={handleCreateChange}
                required
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="number"
                name="duration"
                value={createForm.duration}
                onChange={handleCreateChange}
                min={15}
                max={180}
                required
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="number"
                name="maxParticipants"
                value={createForm.maxParticipants}
                onChange={handleCreateChange}
                min={2}
                max={100}
                required
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="tags"
                value={createForm.tags}
                onChange={handleCreateChange}
                placeholder="Tags (comma separated)"
                className="border rounded-lg px-4 py-2"
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Session"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Floating AI Chatbot Button */}
        <button className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark">
          <span className="material-symbols-outlined text-4xl">smart_toy</span>
        </button>
      </main>
    </div>
  );
}
