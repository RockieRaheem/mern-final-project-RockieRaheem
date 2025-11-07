import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Sessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); // upcoming, ongoing, past

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await api.sessions.getAll();
      setSessions(response.data);
    } catch {
      console.error("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    if (filter === "ongoing") return session.status === "active";
    if (filter === "past") return session.status === "completed";
    return session.status === "scheduled";
  });

  const handleJoinSession = (sessionId) => {
    navigate(`/sessions/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl w-full p-6 lg:p-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-text-light-primary dark:text-text-dark-primary">
              Live Study Sessions
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
              Join live discussions with teachers and fellow students.
            </p>
          </div>
          <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 w-full md:w-auto">
            <span className="material-symbols-outlined mr-2">add_circle</span>
            <span>Create Session</span>
          </button>
        </header>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border-light dark:border-border-dark">
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              filter === "upcoming"
                ? "border-primary text-primary"
                : "border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("ongoing")}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              filter === "ongoing"
                ? "border-primary text-primary"
                : "border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Ongoing
            </div>
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
              filter === "past"
                ? "border-primary text-primary"
                : "border-transparent text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary"
            }`}
          >
            Past
          </button>
        </div>

        {/* Sessions Grid */}
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
                {/* Session Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                      {session.subject}
                    </span>
                    {session.status === "active" && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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

                  {/* Host Info */}
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

                  {/* Session Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <span className="material-symbols-outlined text-base">
                        schedule
                      </span>
                      <span>
                        {new Date(session.scheduledStart).toLocaleString()}
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
                        {session.maxParticipants} participants
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
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

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-black"></div>
            <div className="w-4 h-3 bg-yellow-400"></div>
            <div className="w-4 h-3 bg-red-600"></div>
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-text-light-secondary dark:text-text-dark-secondary">
            For God and My Country
          </p>
        </div>
      </div>
    </div>
  );
}
