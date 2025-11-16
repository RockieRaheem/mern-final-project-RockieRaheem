import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

export default function AnswerDetail() {
  const { answerId } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState(null);
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    async function fetchAnswer() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.answers.getById(answerId);
        const a = res.data?.data || res.data;
        setAnswer(a);
        setHelpfulCount(a.upvotes?.length || 0);

        // Backend now populates question
        if (a.question) {
          if (typeof a.question === "object" && a.question.title) {
            setQuestion(a.question);
          } else if (typeof a.question === "string") {
            const questionRes = await api.questions.getById(a.question);
            const q = questionRes.data?.data || questionRes.data;
            setQuestion(q);
          }
        }
      } catch (err) {
        console.error("Failed to load answer", err);
        setError("Failed to load answer");
      } finally {
        setLoading(false);
      }
    }
    fetchAnswer();
  }, [answerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-text-light-secondary dark:text-text-dark-secondary">
            Loading answer...
          </div>
        </div>
      </div>
    );
  }

  if (error || !answer) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">
            error_outline
          </span>
          <div className="text-text-light-primary dark:text-text-dark-primary text-xl font-semibold mb-2">
            {error || "Answer not found"}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-border-light dark:border-border-dark px-4 sm:px-6 lg:px-10 py-3 bg-surface-light dark:bg-surface-dark sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-text-light dark:text-text-dark"
          >
            <svg
              className="h-8 w-8 text-primary"
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_319)">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
            <h2 className="text-xl font-bold leading-tight">Edulink</h2>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark hover:bg-zinc-200 dark:hover:bg-zinc-800">
            <span className="material-symbols-outlined text-2xl">
              notifications
            </span>
          </button>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-300"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto flex-1 p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() =>
              question
                ? navigate(`/questions/${question._id || question.id}`)
                : navigate(-1)
            }
            className="inline-flex items-center gap-1.5 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back to Question
          </button>
        </div>

        {/* Answer Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
          {/* Answer Content */}
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex-shrink-0 bg-gray-300"
                style={
                  answer.author?.avatar
                    ? { backgroundImage: `url(${answer.author.avatar})` }
                    : {}
                }
              ></div>
              <div className="flex-1">
                <p className="font-semibold text-text-light dark:text-text-dark">
                  {answer.author?.name || "Anonymous"}
                </p>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Answered on{" "}
                  {new Date(answer.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-text-light dark:text-text-dark">
              <p className="whitespace-pre-wrap leading-relaxed">
                {answer.body || answer.content}
              </p>
            </div>
          </div>

          {/* Images Section */}
          {answer.attachments && answer.attachments.length > 0 && (
            <div className="border-t border-border-light dark:border-border-dark p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
                Images
              </h3>
              <div className="space-y-4">
                {answer.attachments.map((attachment, index) => {
                  // Remove /api from the URL since uploads are served from root
                  const baseUrl = (
                    import.meta.env.VITE_API_URL || "http://localhost:5001/api"
                  ).replace("/api", "");
                  const fileUrl = `${baseUrl}${attachment.url}`;

                  return (
                    <div key={index} className="my-3">
                      <img
                        src={fileUrl}
                        alt={attachment.originalName || `Image ${index + 1}`}
                        className="w-full max-w-3xl rounded-lg border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions Footer */}
          <div className="border-t border-border-light dark:border-border-dark p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setUserVote("helpful");
                  setHelpfulCount((prev) => prev + 1);
                }}
                className={`flex items-center gap-2 transition-colors ${
                  userVote === "helpful"
                    ? "text-primary"
                    : "text-text-muted-light dark:text-text-muted-dark hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined">thumb_up</span>
                <span className="text-sm font-medium">
                  Helpful ({helpfulCount})
                </span>
              </button>
              <button className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">thumb_down</span>
                <span className="text-sm font-medium">Not Helpful</span>
              </button>
            </div>
            <button className="flex items-center gap-2 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors">
              <span className="material-symbols-outlined">flag</span>
              <span className="text-sm font-medium">Report</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center p-6 mt-8 text-text-muted-light dark:text-text-muted-dark">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-4 w-6">
            <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
              <rect fill="#000000" height="40" width="60"></rect>
              <rect fill="#FCDC04" height="13.33" width="60" y="13.33"></rect>
              <rect fill="#D90000" height="13.33" width="60" y="26.67"></rect>
            </svg>
          </div>
          <p className="text-sm">For God and My Country</p>
        </div>
        <p className="text-xs">© 2024 Edulink. All rights reserved.</p>
      </footer>

      {/* Chatbot FAB */}
      <button className="fixed bottom-6 right-6 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105">
        <span className="material-symbols-outlined text-3xl">smart_toy</span>
      </button>
    </div>
  );
}
