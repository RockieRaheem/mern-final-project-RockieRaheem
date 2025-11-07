import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerContent, setAnswerContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestionAndAnswers = useCallback(async () => {
    try {
      setLoading(true);
      const [questionRes, answersRes] = await Promise.all([
        api.questions.getById(id),
        api.answers.getByQuestion(id),
      ]);
      setQuestion(questionRes.data);
      setAnswers(answersRes.data);
    } catch {
      console.error("Failed to load question");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [fetchQuestionAndAnswers]);

  const handleUpvote = async () => {
    try {
      await api.questions.upvote(id);
      setQuestion((prev) => ({
        ...prev,
        upvotes: prev.upvotes + 1,
      }));
    } catch {
      console.error("Failed to upvote");
    }
  };

  const handleBookmark = async () => {
    try {
      await api.questions.bookmark(id);
      setQuestion((prev) => ({
        ...prev,
        isBookmarked: !prev.isBookmarked,
      }));
    } catch {
      console.error("Failed to bookmark");
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.answers.create({
        questionId: id,
        content: answerContent,
      });
      setAnswers([response.data, ...answers]);
      setAnswerContent("");
    } catch {
      console.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteAnswer = async (answerId) => {
    try {
      await api.answers.upvote(answerId);
      setAnswers((prev) =>
        prev.map((answer) =>
          answer._id === answerId
            ? { ...answer, upvotes: answer.upvotes + 1 }
            : answer
        )
      );
    } catch {
      console.error("Failed to upvote answer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-text-light-secondary dark:text-text-dark-secondary">
          Loading...
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-text-light-secondary dark:text-text-dark-secondary">
          Question not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto p-6 lg:p-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary mb-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back to Feed</span>
        </button>

        {/* Question Card */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark mb-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <img
              src={
                question.author?.avatar ||
                `https://ui-avatars.com/api/?name=${
                  question.author?.name || "User"
                }`
              }
              alt={question.author?.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                    {question.author?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    · {new Date(question.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                    {question.subject}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300">
                    {question.level}
                  </span>
                </div>
              </div>

              {/* Question Title */}
              <h1 className="text-2xl font-bold mt-3 text-text-light-primary dark:text-text-dark-primary leading-snug">
                {question.title}
              </h1>

              {/* Question Content */}
              <p className="mt-3 text-text-light-secondary dark:text-text-dark-secondary leading-relaxed">
                {question.content}
              </p>

              {/* Image if exists */}
              {question.image && (
                <img
                  src={question.image}
                  alt="Question attachment"
                  className="mt-4 rounded-lg w-full max-h-96 object-contain border border-border-light dark:border-border-dark"
                />
              )}

              {/* Actions */}
              <div className="mt-5 flex items-center justify-between text-text-light-secondary dark:text-text-dark-secondary">
                <div className="flex items-center gap-5">
                  <button
                    onClick={handleUpvote}
                    className="flex items-center gap-1.5 hover:text-primary dark:hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-xl">
                      thumb_up
                    </span>
                    <span className="text-sm font-medium">
                      {question.upvotes || 0}
                    </span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xl">
                      chat_bubble_outline
                    </span>
                    <span className="text-sm font-medium">
                      {answers.length} Answers
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleBookmark}
                  className="flex items-center gap-1.5 hover:text-primary dark:hover:text-primary"
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      question.isBookmarked ? "filled" : ""
                    }`}
                  >
                    bookmark
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Form */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark mb-6">
          <h2 className="text-lg font-bold mb-4 text-text-light-primary dark:text-text-dark-primary">
            Your Answer
          </h2>
          <form onSubmit={handleSubmitAnswer}>
            <textarea
              className="form-textarea w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-3 px-4 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Share your knowledge and help out..."
              rows="4"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !answerContent.trim()}
                className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-semibold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Posting..." : "Post Answer"}
              </button>
            </div>
          </form>
        </div>

        {/* Answers Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          {answers.map((answer) => (
            <div
              key={answer._id}
              className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    answer.author?.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      answer.author?.name || "User"
                    }`
                  }
                  alt={answer.author?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                      {answer.author?.name || "Anonymous"}
                    </p>
                    {answer.isVerified && (
                      <span className="material-symbols-outlined text-green-500 filled text-sm">
                        verified
                      </span>
                    )}
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      · {new Date(answer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-text-light-secondary dark:text-text-dark-secondary leading-relaxed">
                    {answer.content}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => handleUpvoteAnswer(answer._id)}
                      className="flex items-center gap-1.5 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-base">
                        thumb_up
                      </span>
                      <span className="text-sm font-medium">
                        {answer.upvotes || 0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {answers.length === 0 && (
            <div className="bg-card-light dark:bg-card-dark p-12 rounded-xl text-center border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-5xl text-text-light-secondary dark:text-text-dark-secondary mb-3">
                forum
              </span>
              <p className="text-text-light-secondary dark:text-text-dark-secondary">
                No answers yet. Be the first to help!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
