import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

export default function LiveSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [session] = useState({
    title: "Physics A'Level: Projectile Motion",
    host: "Mr. Atwine",
    subject: "Physics",
  });
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "Mr. Atwine",
      role: "host",
      audio: true,
      video: true,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBCi-NeB-ZxmQaEWWauPgew3CbgViTjS2ji87aAcPPSgveaDTLA1UKc42Jm0s5q0A5gpBug-4E9lHJgcmTazX3tq0UTTybg7AGcJys5JL9se_AGT-_DkoV8K7Wc5BwHdpBBb5wO1Ab2XGc-S3FrIQ8y6Np3msSGzwRjHJmM2v9OSjiFsbOyZbjMSrYsT1q10rpXNnxK8gKJvHbjntHEpPxQHvq5ed9OoKkwBY-VZrrJGlqpxrwTGtArTUQHxHJl6qzPaueV5Ps8NJw",
    },
    {
      id: 2,
      name: user?.name || "John Doe",
      role: "you",
      audio: true,
      video: true,
      avatar: user?.avatar || null,
    },
    {
      id: 3,
      name: "Grace Nakato",
      role: "participant",
      audio: true,
      video: true,
      isPinned: true,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD9q-7KVsdwlN3iKSogqEJsdzXM4kyzbsg7KhckxepxBBBo1M8bus3lR-6S3-DfHVLivn7z7RH285FHUg38HTJlCafofCTX4pySdzahdSIiLJXsyS5VjTPjXc88jJUAPl0T72J5LM-pTl3RF47RoeawnmDLFAENXoyIvo554bHBegUA22xcb6uZsitreMAf-02Xnyg0U1U1ML9d7EXHgQErMWl42WOCAT192xkn66f9XLyR63RHDYVhL0kxxibos31CGofS224e84I",
    },
    {
      id: 4,
      name: "David Okello",
      role: "participant",
      audio: false,
      video: false,
      avatar: null,
    },
    {
      id: 5,
      name: "Aisha Nanteza",
      role: "participant",
      audio: false,
      video: false,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDnD90rBqnGn9vvTZsanI2s4W1jQGZX5Ag1NH2QuHsh-kLJDi_QGyohPHhCwRi0-EU__JbLHsWmK0u1JjKdqSeHLtnZfBdGUVRqJilyR5Hwzz0N_keQhEa0hm3dSFy7DlOW_VqRXl6s3YPgqtaoAceMXQOPz0f3ZJPCQwelbBMdAS4lVahrfoOeT50mI0yv2hKkxJDzWW4osg1HoCT4VLtJyhG9B-3C94k7u7WrvMiSFlnAwiBKqbb-cZf0yb0EsYjcBQSyhBtBCzk",
    },
    {
      id: 6,
      name: "Another Student",
      role: "participant",
      audio: false,
      video: false,
      avatar: null,
    },
    {
      id: 7,
      name: "Last Student",
      role: "participant",
      audio: false,
      video: false,
      avatar: null,
    },
  ]);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showPoll, setShowPoll] = useState(false);
  const [activeTab, setActiveTab] = useState("participants");
  const [searchQuery, setSearchQuery] = useState("");
  const [raisedHands, setRaisedHands] = useState([
    {
      id: 3,
      name: "Grace Nakato",
      time: "1 min ago",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD9q-7KVsdwlN3iKSogqEJsdzXM4kyzbsg7KhckxepxBBBo1M8bus3lR-6S3-DfHVLivn7z7RH285FHUg38HTJlCafofCTX4pySdzahdSIiLJXsyS5VjTPjXc88jJUAPl0T72J5LM-pTl3RF47RoeawnmDLFAENXoyIvo554bHBegUA22xcb6uZsitreMAf-02Xnyg0U1U1ML9d7EXHgQErMWl42WOCAT192xkn66f9XLyR63RHDYVhL0kxxibos31CGofS224e84I",
    },
    { id: 4, name: "David Okello", time: "30 sec ago", avatar: null },
  ]);
  const [sessionDuration, setSessionDuration] = useState("01:23:45");

  // Refs
  const socketRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Initialize session duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const hours = Math.floor(elapsed / 3600000);
      const minutes = Math.floor((elapsed % 3600000) / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setSessionDuration(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Socket.IO connection
  useEffect(() => {
    socketRef.current = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5001"
    );

    socketRef.current.emit("join-session", {
      sessionId: id,
      userId: user?._id,
    });

    socketRef.current.on("user-joined", (participant) => {
      setParticipants((prev) => [...prev, participant]);
    });

    socketRef.current.on("user-left", (userId) => {
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    });

    socketRef.current.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("hand-raised", ({ userId, userName }) => {
      setRaisedHands((prev) => [
        ...prev,
        { id: userId, name: userName, time: "Just now" },
      ]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-session", { sessionId: id });
        socketRef.current.disconnect();
      }
    };
  }, [id, user]);

  // Handlers
  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);
  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);

  const sendMessage = () => {
    if (messageInput.trim()) {
      const message = {
        id: Date.now(),
        sender: user?.name || "You",
        text: messageInput,
        timestamp: new Date().toLocaleTimeString(),
      };
      socketRef.current?.emit("send-message", { sessionId: id, message });
      setMessages((prev) => [...prev, message]);
      setMessageInput("");
    }
  };

  const leaveSession = () => {
    if (confirm("Are you sure you want to leave this session?")) {
      navigate("/sessions");
    }
  };

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="flex h-screen w-full flex-col">
        {/* Header */}
        <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-black"></div>
              <div className="w-4 h-3 bg-yellow-400"></div>
              <div className="w-4 h-3 bg-red-600"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
                {session.title}
              </h1>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Hosted by {session.host}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-surface-light dark:bg-surface-dark px-3 py-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-success"></div>
              <span className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                {sessionDuration}
              </span>
            </div>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button
              onClick={leaveSession}
              className="flex items-center justify-center rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-danger/90"
            >
              <span className="material-symbols-outlined mr-1.5 text-base">
                logout
              </span>
              Leave
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Video Area */}
          <main className="flex flex-1 flex-col bg-background-light dark:bg-background-dark">
            <div className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
              <div className="relative col-span-full h-full min-h-[200px] rounded-xl overflow-hidden bg-background-dark dark:bg-card-dark border-2 border-primary shadow-lg">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 h-full p-2">
                  {/* Host Video - Large */}
                  <div className="relative col-span-2 row-span-2 rounded-lg overflow-hidden bg-black flex items-center justify-center">
                    {participants[0]?.avatar ? (
                      <img
                        alt="Host video feed"
                        className="h-full w-full object-cover"
                        src={participants[0].avatar}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                        <div className="text-white text-4xl font-bold">
                          {getInitials(participants[0]?.name || "Host")}
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-white backdrop-blur-sm">
                      <span className="material-symbols-outlined text-success filled text-base">
                        star
                      </span>
                      <span className="text-sm font-semibold">
                        {session.host} (Host)
                      </span>
                    </div>
                  </div>

                  {/* Participant Videos */}
                  {participants.slice(1, 7).map((participant) => (
                    <div
                      key={participant.id}
                      className="relative rounded-lg overflow-hidden bg-black flex items-center justify-center"
                    >
                      {participant.avatar && participant.video ? (
                        <img
                          alt={`${participant.name} video feed`}
                          className="h-full w-full object-cover"
                          src={participant.avatar}
                        />
                      ) : participant.video ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                          <div className="text-white text-2xl font-bold">
                            {getInitials(participant.name)}
                          </div>
                        </div>
                      ) : null}

                      <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-lg bg-black/50 px-2 py-1 text-white backdrop-blur-sm">
                        <span className="text-xs font-medium">
                          {participant.role === "you"
                            ? `${participant.name} (You)`
                            : participant.name.split(" ")[0] +
                              " " +
                              participant.name.split(" ")[1]?.charAt(0) +
                              "."}
                        </span>
                      </div>

                      {participant.isPinned && (
                        <div className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-warning">
                          <span className="material-symbols-outlined text-base filled">
                            push_pin
                          </span>
                        </div>
                      )}

                      {!participant.video && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="material-symbols-outlined text-white/50 text-3xl">
                            videocam_off
                          </span>
                        </div>
                      )}

                      <button
                        aria-label={`${participant.audio ? "Mute" : "Unmute"} ${
                          participant.name
                        }`}
                        className="absolute top-2 left-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                      >
                        <span
                          className={`material-symbols-outlined text-base ${
                            !participant.audio ? "text-danger" : ""
                          }`}
                        >
                          {participant.audio ? "mic" : "mic_off"}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Poll Overlay */}
                {showPoll && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-xl w-3/4 max-w-lg">
                      <h3 className="text-lg font-bold mb-4">
                        Quick Poll: What is the primary force in Projectile
                        Motion?
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark p-3 rounded-lg cursor-pointer hover:bg-surface-light/70 dark:hover:bg-surface-dark/70">
                          <input
                            className="form-radio text-primary focus:ring-primary/50"
                            name="poll-answer"
                            type="radio"
                            value="gravity"
                          />
                          <span>Gravity</span>
                        </label>
                        <label className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark p-3 rounded-lg cursor-pointer hover:bg-surface-light/70 dark:hover:bg-surface-dark/70">
                          <input
                            className="form-radio text-primary focus:ring-primary/50"
                            name="poll-answer"
                            type="radio"
                            value="air_resistance"
                          />
                          <span>Air Resistance</span>
                        </label>
                        <label className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark p-3 rounded-lg cursor-pointer hover:bg-surface-light/70 dark:hover:bg-surface-dark/70">
                          <input
                            className="form-radio text-primary focus:ring-primary/50"
                            name="poll-answer"
                            type="radio"
                            value="initial_velocity"
                          />
                          <span>Initial Velocity</span>
                        </label>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={() => setShowPoll(false)}
                          className="px-4 py-2 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark"
                        >
                          Cancel
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90">
                          Submit Poll
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex h-24 flex-shrink-0 items-center justify-center gap-4 border-t border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
              <button
                onClick={toggleAudio}
                aria-label="Toggle Microphone"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-3xl">
                  {isAudioEnabled ? "mic" : "mic_off"}
                </span>
              </button>
              <button
                onClick={toggleVideo}
                aria-label="Toggle Video Camera"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-3xl">
                  {isVideoEnabled ? "videocam" : "videocam_off"}
                </span>
              </button>
              <button className="flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 h-14 px-5 text-sm font-medium gap-2">
                <span className="material-symbols-outlined text-3xl">
                  mic_off
                </span>
                Mute All
              </button>
              <button className="flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 h-14 px-5 text-sm font-medium gap-2">
                <span className="material-symbols-outlined text-3xl">
                  pan_tool
                </span>
                Raise Hand Queue ({raisedHands.length})
              </button>
              <button className="flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 h-14 px-5 text-sm font-medium gap-2">
                <span className="material-symbols-outlined text-3xl">
                  group_add
                </span>
                Breakout Rooms
              </button>
              <button
                onClick={() => setShowPoll(true)}
                className="flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 h-14 px-5 text-sm font-medium gap-2"
              >
                <span className="material-symbols-outlined text-3xl">poll</span>
                Quick Poll
              </button>
              <button className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                <span className="material-symbols-outlined text-3xl">
                  more_vert
                </span>
              </button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="hidden w-[360px] flex-shrink-0 border-l border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark md:flex flex-col">
            {/* Tabs */}
            <div className="flex h-16 flex-shrink-0 border-b border-border-light dark:border-border-dark">
              <button
                onClick={() => setActiveTab("participants")}
                className={`flex-1 flex items-center justify-center gap-2 ${
                  activeTab === "participants"
                    ? "border-b-2 border-primary text-primary"
                    : "text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark"
                }`}
              >
                <span className="material-symbols-outlined">groups</span>
                <span className="text-sm font-semibold">
                  Participants ({participants.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 flex items-center justify-center gap-2 ${
                  activeTab === "chat"
                    ? "border-b-2 border-primary text-primary"
                    : "text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark"
                }`}
              >
                <span className="material-symbols-outlined">chat</span>
                <span className="text-sm font-semibold">Chat</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "participants" ? (
                <>
                  {/* Search */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search participants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {/* Participants List */}
                  <div className="space-y-2">
                    {filteredParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold">
                            {participant.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                              {participant.name}
                            </p>
                            {participant.role === "host" && (
                              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                                Host
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {participant.audio ? (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                              />
                            </svg>
                          )}
                          {participant.video && (
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Raised Hands Section */}
                  {raisedHands.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                        <svg
                          className="w-5 h-5 text-yellow-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        Raised Hands ({raisedHands.length})
                      </h3>
                      <div className="space-y-2">
                        {raisedHands.map((hand) => (
                          <div
                            key={hand.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                                {hand.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-yellow-900 dark:text-yellow-100">
                                  {hand.name}
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                  {hand.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Chat Messages */}
                  <div className="flex-1 space-y-3 mb-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <svg
                          className="w-12 h-12 mx-auto mb-2 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs mt-1">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {msg.sender.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                {msg.sender}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {msg.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="sticky bottom-0 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!messageInput.trim()}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 border-t border-border-light dark:border-border-dark p-4">
              <div className="text-center">
                <p className="text-xs font-semibold tracking-widest uppercase text-text-light-secondary dark:text-text-dark-secondary">
                  For God and My Country
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating AI Chatbot Button */}
      <button className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark">
        <span className="material-symbols-outlined text-4xl">smart_toy</span>
      </button>
    </div>
  );
}
