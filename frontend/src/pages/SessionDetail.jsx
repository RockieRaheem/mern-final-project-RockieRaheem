import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api";

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await api.sessions.getOne(id);
      setSession(response.data.data);
    } catch (err) {
      setError(err.message || "Failed to fetch session");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setJoining(true);
    try {
      await api.sessions.join(id);
      // Navigate to live session
      navigate(`/sessions/${id}/live`);
    } catch (err) {
      setError(err.message || "Failed to join session");
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "teacher-led":
        return "bg-purple-100 text-purple-800";
      case "student-led":
        return "bg-orange-100 text-orange-800";
      case "group-study":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isHost = user && session?.host?._id === user._id;
  const isParticipant =
    user && session?.participants?.some((p) => p.user._id === user._id);
  const canJoin = session?.status === "live" || session?.status === "scheduled";

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary mb-4">
              Session Not Found
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
              {error || "The session you're looking for doesn't exist."}
            </p>
            <Link
              to="/sessions"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Sessions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/sessions"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Back to Sessions
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
                {session.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    session.status
                  )}`}
                >
                  {session.status.charAt(0).toUpperCase() +
                    session.status.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                    session.type
                  )}`}
                >
                  {session.type
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary rounded-full text-sm font-medium">
                  {session.subject}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary rounded-full text-sm font-medium">
                  {session.educationLevel}
                </span>
              </div>

              {session.description && (
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-lg leading-relaxed">
                  {session.description}
                </p>
              )}
            </div>

            <div className="lg:w-80">
              <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
                <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
                  Session Details
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary mr-3">
                      calendar_today
                    </span>
                    <span className="text-text-light-primary dark:text-text-dark-primary">
                      {formatDate(session.startTime)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary mr-3">
                      schedule
                    </span>
                    <span className="text-text-light-primary dark:text-text-dark-primary">
                      {formatTime(session.startTime)} -{" "}
                      {formatTime(
                        new Date(
                          new Date(session.startTime).getTime() +
                            (session.duration || 60) * 60000
                        )
                      )}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary mr-3">
                      timer
                    </span>
                    <span className="text-text-light-primary dark:text-text-dark-primary">
                      {session.duration || 60} minutes
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary mr-3">
                      group
                    </span>
                    <span className="text-text-light-primary dark:text-text-dark-primary">
                      {session.participants?.length || 0} /{" "}
                      {session.maxParticipants || 50} participants
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  {isHost ? (
                    <button
                      onClick={() => navigate(`/sessions/${id}/live`)}
                      className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      {session.status === "live"
                        ? "Continue Session"
                        : "Start Session"}
                    </button>
                  ) : isParticipant ? (
                    <button
                      onClick={() => navigate(`/sessions/${id}/live`)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Rejoin Session
                    </button>
                  ) : canJoin ? (
                    <button
                      onClick={handleJoinSession}
                      disabled={joining}
                      className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {joining ? "Joining..." : "Join Session"}
                    </button>
                  ) : (
                    <div className="w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 py-3 px-4 rounded-lg text-center font-medium">
                      {session.status === "ended"
                        ? "Session Ended"
                        : "Session Unavailable"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Host Information */}
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark mb-8">
          <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
            Hosted by
          </h3>

          <div className="flex items-center">
            <img
              src={session.host?.avatar || "/default-avatar.png"}
              alt={session.host?.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="font-medium text-text-light-primary dark:text-text-dark-primary">
                {session.host?.name}
              </p>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                {session.host?.role === "teacher" ? "Teacher" : "Student"}
                {session.host?.verified && (
                  <span className="ml-2 inline-flex items-center">
                    <span className="material-symbols-outlined text-green-600 text-sm">
                      verified
                    </span>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Participants */}
        {session.participants && session.participants.length > 0 && (
          <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 border border-border-light dark:border-border-dark">
            <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">
              Participants ({session.participants.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {session.participants.map((participant, index) => (
                <div key={index} className="flex items-center">
                  <img
                    src={participant.user?.avatar || "/default-avatar.png"}
                    alt={participant.user?.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-text-light-primary dark:text-text-dark-primary text-sm">
                      {participant.user?.name}
                    </p>
                    <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                      Joined{" "}
                      {new Date(participant.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
