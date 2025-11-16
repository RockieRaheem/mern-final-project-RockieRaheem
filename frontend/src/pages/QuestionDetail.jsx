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

      console.log("========== SUBMITTING ANSWER ==========");
      console.log("Attachments to upload:", attachments);

      attachments.forEach((file, index) => {
        console.log(
          `Appending file ${index}:`,
          file.name,
          file.type,
          file.size
        );
        formData.append("images", file);
      });

      // Log all FormData entries
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      console.log("=====================================");

      const response = await api.answers.create(formData);
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

  const renderAttachment = (attachment, index) => {
    // Debug: log attachment to see what we have
    console.log("Rendering attachment:", attachment);

    // Remove /api from the URL since uploads are served from root
    const baseUrl = (
      import.meta.env.VITE_API_URL || "http://localhost:5001/api"
    ).replace("/api", "");
    const fileUrl = `${baseUrl}${attachment.url}`;

    // Extract filename from URL if not directly available
    // URL format: /uploads/attachments-123456.pdf
    const urlParts = attachment.url?.split("/") || [];
    const filenameFromUrl = urlParts[urlParts.length - 1] || "file";
    const filename = attachment.filename || filenameFromUrl;
    const originalName =
      attachment.originalName || attachment.originalname || filename;

    console.log("Extracted:", { filename, originalName, url: attachment.url });

    // Detect file type if not set or if it's "other"
    let fileType = attachment.fileType;
    if (!fileType || fileType === "other") {
      const ext = (originalName || filename).toLowerCase();
      const mimeType = (attachment.mimeType || "").toLowerCase();

      if (
        mimeType.startsWith("image/") ||
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(ext)
      ) {
        fileType = "image";
      } else if (
        mimeType.startsWith("video/") ||
        /\.(mp4|webm|ogg|avi|mov)$/i.test(ext)
      ) {
        fileType = "video";
      } else if (mimeType === "application/pdf" || /\.pdf$/i.test(ext)) {
        fileType = "pdf";
      } else if (
        mimeType.includes("word") ||
        mimeType.includes("document") ||
        mimeType.includes("text") ||
        /\.(doc|docx|txt|rtf|odt)$/i.test(ext)
      ) {
        fileType = "document";
      }
    }

    return (
      <div
        key={index}
        className="mt-4 border border-border-light dark:border-border-dark rounded-lg overflow-hidden"
      >
        {fileType === "image" && (
          <div className="my-3">
            <img
              src={fileUrl}
              alt={originalName}
              className="w-full max-w-3xl rounded-lg border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow"
              loading="lazy"
            />
          </div>
        )}

        {/* Skip video, PDF, documents - images only now */}
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

        {/* Answer Form - Professional Design */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm mb-6">
          <div className="p-6">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Replying to:
            </p>
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
              "{question.title}"
            </h2>
          </div>

          <div className="border-t border-border-light dark:border-border-dark p-6">
            <label
              className="block text-lg font-semibold text-text-light dark:text-text-dark mb-4"
              htmlFor="answer-content"
            >
              Your Answer
            </label>
            <form onSubmit={handleSubmitAnswer}>
              <div className="rounded-lg border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50">
                {/* Toolbar */}
                <div className="flex items-center gap-1 border-b border-border-light dark:border-border-dark p-2 flex-wrap">
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted-light dark:text-text-muted-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      format_bold
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted-light dark:text-text-muted-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      format_italic
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted-light dark:text-text-muted-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      format_underlined
                    </span>
                  </button>
                  <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1"></div>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted-light dark:text-text-muted-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      format_list_bulleted
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted-light dark:text-text-muted-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      format_list_numbered
                    </span>
                  </button>
                  <div className="w-px h-6 bg-border-light dark:bg-border-dark mx-1"></div>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted-light dark:text-text-muted-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      link
                    </span>
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-text-muted-light dark:text-text-muted-dark"
                  >
                    <span className="material-symbols-outlined text-xl">
                      code
                    </span>
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  id="answer-content"
                  className="w-full min-h-[250px] p-4 bg-transparent border-0 focus:ring-0 text-text-light dark:text-text-dark placeholder:text-text-muted-light resize-none"
                  placeholder="Type your detailed answer here..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
                  Add Images (Optional)
                </h3>
                <div className="relative border-2 border-dashed border-border-light dark:border-border-dark rounded-lg p-8 text-center cursor-pointer hover:border-primary dark:hover:border-primary hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex flex-col items-center justify-center text-text-muted-light dark:text-text-muted-dark">
                    <span className="material-symbols-outlined text-5xl">
                      add_photo_alternate
                    </span>
                    <p className="mt-2 font-medium text-text-light dark:text-text-dark">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs mt-1">
                      PNG, JPG, JPEG (Max 3 images)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/jpg"
                    ref={fileInputRef}
                    onChange={(e) => setAttachments(Array.from(e.target.files))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Image Preview */}
                {attachments.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {attachments.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded-lg border border-border-light dark:border-border-dark"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newAttachments = attachments.filter(
                              (_, i) => i !== index
                            );
                            setAttachments(newAttachments);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm">
                            close
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    (!answerContent.trim() && attachments.length === 0)
                  }
                  className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">send</span>
                  {submitting ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Answers Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>

          {answers.map((answer) => (
            <div
              key={answer._id}
              onClick={() => navigate(`/answers/${answer._id}`)}
              className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
            >
              {/* Answer Preview - Author Info Only */}
              <div className="p-6">
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
                      <div className="flex-1">
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

                        {/* Answer Preview Text */}
                        <p className="mt-3 text-text-light-secondary dark:text-text-dark-secondary leading-relaxed line-clamp-2">
                          {answer.body || answer.content}
                        </p>

                        {/* Attachment Indicator */}
                        {answer.attachments &&
                          answer.attachments.length > 0 && (
                            <div className="flex items-center gap-2 mt-3 text-sm text-primary">
                              <span className="material-symbols-outlined text-base">
                                attach_file
                              </span>
                              <span>
                                {answer.attachments.length}{" "}
                                {answer.attachments.length === 1
                                  ? "attachment"
                                  : "attachments"}
                              </span>
                            </div>
                          )}

                        {/* View Full Answer Link */}
                        <div className="flex items-center gap-1 mt-3 text-sm text-primary hover:text-primary/80 font-semibold">
                          <span>View full answer</span>
                          <span className="material-symbols-outlined text-base">
                            arrow_forward
                          </span>
                        </div>
                      </div>

                      {/* Likes on the side */}
                      <div className="flex flex-col items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvoteAnswer(answer._id);
                          }}
                          className="flex items-center gap-1 text-text-light-secondary dark:text-text-dark-secondary hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">
                            thumb_up
                          </span>
                        </button>
                        <span className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">
                          {Array.isArray(answer.upvotes)
                            ? answer.upvotes.length
                            : answer.upvotes || 0}
                        </span>
                      </div>
                    </div>
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
