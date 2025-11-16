import { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef();

  const fetchQuestionAndAnswers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [questionRes, answersRes] = await Promise.all([
        api.questions.getById(id),
        api.answers.getByQuestion(id),
      ]);
      // Defensive: handle backend response shape
      const q = questionRes.data?.data || questionRes.data;
      setQuestion({
        ...q,
        // fallback for body/content
        content: q.body || q.content || "",
        // fallback for educationLevel/level
        level: q.educationLevel || q.level || "",
        upvotes: Array.isArray(q.upvotes) ? q.upvotes.length : q.upvotes || 0,
        isBookmarked: !!q.isBookmarked,
      });
      // Defensive: answers array
      let ans = answersRes.data?.data || answersRes.data;
      if (!Array.isArray(ans)) ans = [];
      setAnswers(ans);
    } catch {
      setError("Failed to load question");
      setQuestion(null);
      setAnswers([]);
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

    if (!answerContent.trim() && attachments.length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("question", id);
      formData.append("body", answerContent);
      attachments.forEach((file) => {
        formData.append("attachments", file);
      });
      const response = await api.answers.create(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newAnswer = response.data?.data || response.data;
      setAnswers([newAnswer, ...answers]);
      setAnswerContent("");
      setAttachments([]);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      console.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteAnswer = async (answerId) => {
    try {
      await api.answers.vote(answerId, { voteType: "upvote" });
      await fetchQuestionAndAnswers();
    } catch {
      console.error("Failed to upvote answer");
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "image":
        return "image";
      case "video":
        return "videocam";
      case "pdf":
        return "picture_as_pdf";
      case "document":
        return "description";
      default:
        return "attachment";
    }
  };

  const renderAttachment = (attachment, index) => {
    const fileUrl = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }${attachment.url}`;

    return (
      <div
        key={index}
        className="mt-4 border border-border-light dark:border-border-dark rounded-lg overflow-hidden"
      >
        {attachment.fileType === "image" && (
          <div className="relative group">
            <img
              src={fileUrl}
              alt={attachment.originalName || "Attachment"}
              className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-900"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">
                  {attachment.originalName}
                </span>
                <a
                  href={fileUrl}
                  download={attachment.originalName}
                  className="flex items-center gap-1 text-white hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined text-xl">
                    download
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}

        {attachment.fileType === "video" && (
          <div className="bg-black">
            <video controls className="w-full max-h-96" preload="metadata">
              <source src={fileUrl} type={attachment.mimeType} />
              Your browser does not support the video tag.
            </video>
            <div className="bg-gray-800 p-3 flex items-center justify-between">
              <span className="text-white text-sm">
                {attachment.originalName}
              </span>
              <a
                href={fileUrl}
                download={attachment.originalName}
                className="flex items-center gap-1 text-white hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="material-symbols-outlined text-xl">
                  download
                </span>
              </a>
            </div>
          </div>
        )}

        {(attachment.fileType === "pdf" ||
          attachment.fileType === "document") && (
          <div className="bg-gray-50 dark:bg-gray-900 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">
                  {getFileIcon(attachment.fileType)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-text-light-primary dark:text-text-dark-primary truncate">
                  {attachment.originalName}
                </h4>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                  {attachment.size
                    ? `${(attachment.size / 1024).toFixed(2)} KB`
                    : "File"}
                </p>
                <div className="flex gap-3 mt-3">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-lg">
                      visibility
                    </span>
                    View
                  </a>
                  <a
                    href={fileUrl}
                    download={attachment.originalName}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="material-symbols-outlined text-lg">
                      download
                    </span>
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
  if (error) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-red-500">{error}</div>
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
              <p className="mt-3 text-text-light-secondary dark:text-text-dark-secondary leading-relaxed whitespace-pre-wrap">
                {question.content || question.body}
              </p>

              {/* Question Attachments */}
              {question.attachments && question.attachments.length > 0 && (
                <div className="space-y-4 mt-4">
                  {question.attachments.map((attachment, index) =>
                    renderAttachment(attachment, index)
                  )}
                </div>
              )}

              {/* Legacy Image Support */}
              {question.image && !question.attachments && (
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
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-text-light-primary dark:text-text-dark-primary">
                Attach files (images, videos, PDFs, documents)
              </label>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                ref={fileInputRef}
                onChange={(e) => setAttachments(Array.from(e.target.files))}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              />
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-text-light-secondary dark:text-text-dark-secondary bg-gray-50 dark:bg-gray-900 p-2 rounded"
                    >
                      <span className="material-symbols-outlined text-primary">
                        {file.type.startsWith("image/")
                          ? "image"
                          : file.type.startsWith("video/")
                          ? "videocam"
                          : file.type === "application/pdf"
                          ? "picture_as_pdf"
                          : "description"}
                      </span>
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-xs">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={
                  submitting ||
                  (!answerContent.trim() && attachments.length === 0)
                }
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
              className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden"
            >
              {/* Answer Header */}
              <div className="p-6 border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900/30">
                <div className="flex items-start gap-4">
                  <img
                    src={
                      answer.author?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        answer.author?.name || "User"
                      )}&background=10b981&color=fff`
                    }
                    alt={answer.author?.name}
                    className="w-12 h-12 rounded-full ring-2 ring-green-500/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-text-light-primary dark:text-text-dark-primary">
                            {answer.author?.name || "Anonymous"}
                          </h4>
                          {answer.author?.verified && (
                            <span
                              className="material-symbols-outlined text-blue-500 text-base"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                          )}
                          {answer.author?.role === "teacher" && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                              TEACHER
                            </span>
                          )}
                          {answer.isAccepted && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1">
                              <span
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                check_circle
                              </span>
                              ACCEPTED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          {answer.author?.school && (
                            <span>{answer.author.school}</span>
                          )}
                          {answer.author?.educationLevel && (
                            <>
                              <span>•</span>
                              <span>{answer.author.educationLevel}</span>
                            </>
                          )}
                          {answer.author?.email && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-xs">
                                {answer.author.email}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">
                          {new Date(answer.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer Content */}
              <div className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-text-light-secondary dark:text-text-dark-secondary leading-relaxed whitespace-pre-wrap">
                    {answer.body || answer.content}
                  </p>
                </div>

                {/* Answer Attachments */}
                {answer.attachments && answer.attachments.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {answer.attachments.map((attachment, index) =>
                      renderAttachment(attachment, index)
                    )}
                  </div>
                )}
              </div>

              {/* Answer Actions */}
              <div className="px-6 py-4 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900/30">
                <div className="flex items-center gap-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvoteAnswer(answer._id);
                    }}
                    className="flex items-center gap-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      thumb_up
                    </span>
                    <span className="text-sm font-semibold">
                      {Array.isArray(answer.upvotes)
                        ? answer.upvotes.length
                        : answer.upvotes || 0}
                    </span>
                  </button>
                  {answer.verifiedBy && (
                    <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      <span>Verified by {answer.verifiedBy.name}</span>
                    </div>
                  )}
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
