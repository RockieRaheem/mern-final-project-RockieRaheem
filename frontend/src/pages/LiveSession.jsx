import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

export default function LiveSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(
      import.meta.env.VITE_API_URL || "http://localhost:5001"
    );

    // Join room
    socketRef.current.emit("join-room", { roomId: id, userId: user?._id });

    // Listen for participants updates
    socketRef.current.on("user-joined", (participant) => {
      console.log("User joined:", participant);
    });

    socketRef.current.on("user-left", (userId) => {
      console.log("User left:", userId);
    });

    // Listen for chat messages
    socketRef.current.on("chat-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Get local media stream
    initializeMedia();

    // Store the current video ref for cleanup
    const currentVideoRef = localVideoRef.current;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // Stop all media tracks
      if (currentVideoRef && currentVideoRef.srcObject) {
        currentVideoRef.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [id, user]);

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const toggleAudio = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const handleRaiseHand = () => {
    setHandRaised(!handRaised);
    socketRef.current?.emit("raise-hand", {
      userId: user?._id,
      raised: !handRaised,
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && socketRef.current) {
      const message = {
        userId: user?._id,
        userName: user?.name,
        text: messageInput,
        timestamp: new Date(),
      };
      socketRef.current.emit("chat-message", message);
      setMessageInput("");
    }
  };

  const handleLeave = () => {
    if (confirm("Are you sure you want to leave this session?")) {
      navigate("/sessions");
    }
  };

  return (
    <div className="h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-black"></div>
            <div className="w-4 h-3 bg-yellow-400"></div>
            <div className="w-4 h-3 bg-red-600"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold">
              Physics A'Level: Projectile Motion
            </h1>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
              Hosted by Mr. Atwine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-surface-light dark:bg-surface-dark px-3 py-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
              Live
            </span>
          </div>
          <button
            onClick={handleLeave}
            className="flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700"
          >
            <span className="material-symbols-outlined mr-1.5 text-base">
              logout
            </span>
            Leave
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <main className="flex-1 p-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {/* Local Video */}
            <div className="relative rounded-lg overflow-hidden bg-black">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-white backdrop-blur-sm">
                <span className="text-sm font-medium">{user?.name} (You)</span>
              </div>
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <span className="material-symbols-outlined text-white text-5xl">
                    videocam_off
                  </span>
                </div>
              )}
            </div>

            {/* Participant Videos (Mock) */}
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="relative rounded-lg overflow-hidden bg-black"
              >
                <div className="w-full h-full flex items-center justify-center bg-surface-dark">
                  <span className="material-symbols-outlined text-text-dark-secondary text-5xl">
                    person
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-white backdrop-blur-sm">
                  <span className="text-sm font-medium">Student {num}</span>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Chat Sidebar */}
        {chatOpen && (
          <aside className="w-80 bg-card-light dark:bg-card-dark border-l border-border-light dark:border-border-dark flex flex-col">
            <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
              <h3 className="font-bold">Chat</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="text-text-light-secondary hover:text-text-light-primary dark:text-text-dark-secondary dark:hover:text-text-dark-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-text-light-primary dark:text-text-dark-primary">
                    {msg.userName}
                  </p>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-border-light dark:border-border-dark"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2 px-3 text-sm text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </form>
          </aside>
        )}
      </div>

      {/* Controls */}
      <div className="flex h-24 flex-shrink-0 items-center justify-center gap-4 border-t border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-6">
        <button
          onClick={toggleAudio}
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
            isAudioEnabled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          <span className="material-symbols-outlined text-3xl">
            {isAudioEnabled ? "mic" : "mic_off"}
          </span>
        </button>

        <button
          onClick={toggleVideo}
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
            isVideoEnabled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          <span className="material-symbols-outlined text-3xl">
            {isVideoEnabled ? "videocam" : "videocam_off"}
          </span>
        </button>

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 h-14 px-5 text-sm font-medium gap-2"
        >
          <span className="material-symbols-outlined">chat</span>
          Chat
        </button>

        <button
          onClick={handleRaiseHand}
          className={`flex items-center justify-center rounded-full transition-colors h-14 px-5 text-sm font-medium gap-2 ${
            handRaised
              ? "bg-primary text-white"
              : "bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <span className="material-symbols-outlined">pan_tool</span>
          {handRaised ? "Hand Raised" : "Raise Hand"}
        </button>

        <button
          onClick={() => setShowPoll(!showPoll)}
          className="flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark text-text-light-secondary dark:text-text-dark-secondary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 h-14 px-5 text-sm font-medium gap-2"
        >
          <span className="material-symbols-outlined">poll</span>
          Poll
        </button>
      </div>
    </div>
  );
}
