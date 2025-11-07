import { useState, useRef, useEffect } from "react";
import api from "../../api";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm EduBot, your AI study assistant. How can I help you today? 📚",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.chatbot.sendMessage({
        message: input,
        context: messages.slice(-5), // Send last 5 messages for context
      });

      const botMessage = {
        role: "assistant",
        content: response.data.response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: "calculate",
      text: "Help with Math",
      action: "I need help solving a mathematics problem",
    },
    {
      icon: "science",
      text: "Explain Physics",
      action: "Can you explain a physics concept?",
    },
    {
      icon: "biotech",
      text: "Biology Help",
      action: "I have a question about biology",
    },
    {
      icon: "tips_and_updates",
      text: "Study Tips",
      action: "Give me some study tips",
    },
  ];

  const handleQuickAction = (action) => {
    setInput(action);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark group z-50"
        >
          <span className="material-symbols-outlined text-4xl">smart_toy</span>
          <span className="absolute -top-2 -left-32 w-max bg-card-dark text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
            Need help? Ask EduBot!
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark flex flex-col z-50 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark bg-primary text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">
                  smart_toy
                </span>
              </div>
              <div>
                <h3 className="font-bold">EduBot</h3>
                <p className="text-xs opacity-90">AI Study Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-2 bg-surface-light dark:bg-surface-dark">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-text-light-secondary dark:bg-text-dark-secondary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-text-light-secondary dark:bg-text-dark-secondary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-text-light-secondary dark:bg-text-dark-secondary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(action.action)}
                    className="flex flex-col items-center gap-1 p-3 rounded-lg bg-surface-light dark:bg-surface-dark hover:bg-primary/10 dark:hover:bg-primary/20 border border-border-light dark:border-border-dark transition-colors text-center"
                  >
                    <span className="material-symbols-outlined text-primary text-xl">
                      {action.icon}
                    </span>
                    <span className="text-xs font-medium text-text-light-primary dark:text-text-dark-primary">
                      {action.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-border-light dark:border-border-dark"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 px-4 text-sm text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-primary text-white p-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-4 pb-3 text-center">
            <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
              For God and My Country 🇺🇬
            </p>
          </div>
        </div>
      )}
    </>
  );
}
