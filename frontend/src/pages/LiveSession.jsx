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
      avatar: null,
    },
    {
      id: 2,
      name: user?.name || "You",
      role: "participant",
      audio: true,
      video: true,
      avatar: null,
    },
    {
      id: 3,
      name: "Grace Nakato",
      role: "participant",
      audio: false,
      video: true,
      avatar: null,
    },
    {
      id: 4,
      name: "David Okello",
      role: "participant",
      audio: true,
      video: false,
      avatar: null,
    },
    {
      id: 5,
      name: "Aisha Nanteza",
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
  const [handRaised, setHandRaised] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [activeTab, setActiveTab] = useState("participants");
  const [searchQuery, setSearchQuery] = useState("");
  const [raisedHands, setRaisedHands] = useState([
    { id: 3, name: "Grace Nakato", time: "1 min ago" },
    { id: 4, name: "David Okello", time: "30 sec ago" },
  ]);
  const [sessionDuration, setSessionDuration] = useState("00:00:00");

  // Refs
  const socketRef = useRef(null);
  // Reserved for future video streaming implementation
  // const localVideoRef = useRef(null);
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
  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
    if (!handRaised) {
      socketRef.current?.emit("raise-hand", {
        sessionId: id,
        userId: user?._id,
        userName: user?.name,
      });
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="flex h-20 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6">
        <div className="flex items-center gap-4">
          {/* Uganda Flag */}
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 bg-black"></div>
            <div className="w-4 h-3 bg-yellow-400"></div>
            <div className="w-4 h-3 bg-red-600"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {session.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hosted by {session.host}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Duration Timer */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {sessionDuration}
            </span>
          </div>

          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          <button
            onClick={leaveSession}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Leave
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-5rem)]">
        {/* Main Video Area */}
        <main className="flex-1 p-4 bg-gray-900">
          <div className="h-full rounded-xl overflow-hidden bg-gray-950 border-2 border-blue-500 shadow-2xl">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 h-full p-2">
              {/* Host Video - Large */}
              <div className="relative col-span-2 row-span-2 rounded-lg overflow-hidden bg-black">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                  <div className="text-white text-4xl font-bold">
                    {session.host.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold">
                    {session.host} (Host)
                  </span>
                </div>
              </div>

              {/* Participant Videos */}
              {participants.slice(1, 7).map((participant) => (
                <div
                  key={participant.id}
                  className="relative rounded-lg overflow-hidden bg-black"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                    <div className="text-white text-2xl font-bold">
                      {participant.name.charAt(0)}
                    </div>
                  </div>

                  {!participant.video && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <svg
                        className="w-8 h-8 text-white/50"
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
                        <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} />
                      </svg>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 rounded-lg bg-black/70 px-2 py-1 text-white backdrop-blur-sm">
                    <span className="text-xs font-medium">
                      {participant.name}
                    </span>
                  </div>

                  <button className="absolute top-2 left-2 rounded-full bg-black/70 p-1.5 hover:bg-black/90">
                    {participant.audio ? (
                      <svg
                        className="w-4 h-4 text-white"
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
                        className="w-4 h-4 text-red-500"
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
                  </button>
                </div>
              ))}
            </div>

            {/* Poll Overlay */}
            {showPoll && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl w-full max-w-lg mx-4">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                    Quick Poll: What is the primary force in Projectile Motion?
                  </h3>
                  <div className="space-y-3">
                    {["Gravity", "Air Resistance", "Initial Velocity"].map(
                      (option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <input
                            type="radio"
                            name="poll"
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-900 dark:text-white">
                            {option}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowPoll(false)}
                      className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
                      Submit Poll
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={toggleAudio}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                isAudioEnabled
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isAudioEnabled ? (
                <svg
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
            </button>

            <button
              onClick={toggleVideo}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition ${
                isVideoEnabled
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isVideoEnabled ? (
                <svg
                  className="w-6 h-6"
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
              ) : (
                <svg
                  className="w-6 h-6"
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
                  <line x1="1" y1="1" x2="23" y2="23" strokeWidth={2} />
                </svg>
              )}
            </button>

            <button
              onClick={toggleHandRaise}
              className={`flex items-center gap-2 h-14 px-5 rounded-full font-medium transition ${
                handRaised
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
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
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>
              {handRaised ? "Lower Hand" : "Raise Hand"}
            </button>

            <button
              onClick={() => setShowPoll(true)}
              className="flex items-center gap-2 h-14 px-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Quick Poll
            </button>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden md:flex w-80 flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("participants")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition ${
                activeTab === "participants"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Participants ({participants.length})
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition ${
                activeTab === "chat"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Chat
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
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs font-semibold text-center text-gray-500 dark:text-gray-400 tracking-wider">
              FOR GOD AND MY COUNTRY 🇺🇬
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
