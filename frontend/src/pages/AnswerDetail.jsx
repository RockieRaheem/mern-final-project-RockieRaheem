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

  useEffect(() => {
    async function fetchAnswer() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.answers.getById(answerId);
        const a = res.data?.data || res.data;
        setAnswer(a);
        
        // Fetch the related question
        if (a.question) {
          const questionRes = await api.questions.getById(a.question);
          const q = questionRes.data?.data || questionRes.data;
          setQuestion(q);
        }
      } catch (err) {
        console.error("Failed to load answer", err);
        setError("Failed to load answer");
        setAnswer(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAnswer();
  }, [answerId]);

  const handleUpvote = async () => {
    try {
      await api.answers.vote(answerId, { voteType: "upvote" });
      setAnswer((prev) => ({
        ...prev,
        upvotes: [...(prev.upvotes || []), "temp"],
      }));
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  const handleDownvote = async () => {
    try {
      await api.answers.vote(answerId, { voteType: "downvote" });
      setAnswer((prev) => ({
        ...prev,
        downvotes: [...(prev.downvotes || []), "temp"],
      }));
    } catch (err) {
      console.error("Failed to downvote", err);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image': return 'image';
      case 'video': return 'videocam';
      case 'pdf': return 'picture_as_pdf';
      case 'document': return 'description';
      default: return 'attachment';
    }
  };

  const renderAttachment = (attachment, index) => {
    const fileUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${attachment.url}`;
    
    return (
      <div key={index} className="mt-4 border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
        {attachment.fileType === 'image' && (
          <div className="relative group">
            <img
              src={fileUrl}
              alt={attachment.originalName || 'Attachment'}
              className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-900"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">{attachment.originalName}</span>
                <a
                  href={fileUrl}
                  download={attachment.originalName}
                  className="flex items-center gap-1 text-white hover:text-primary"
                >
                  <span className="material-symbols-outlined text-xl">download</span>
                </a>
              </div>
            </div>
          </div>
        )}
        
        {attachment.fileType === 'video' && (
          <div className="bg-black">
            <video
              controls
              className="w-full max-h-96"
              preload="metadata"
            >
              <source src={fileUrl} type={attachment.mimeType} />
              Your browser does not support the video tag.
            </video>
            <div className="bg-gray-800 p-3 flex items-center justify-between">
              <span className="text-white text-sm">{attachment.originalName}</span>
              <a
                href={fileUrl}
                download={attachment.originalName}
                className="flex items-center gap-1 text-white hover:text-primary"
              >
                <span className="material-symbols-outlined text-xl">download</span>
              </a>
            </div>
          </div>
        )}
        
        {(attachment.fileType === 'pdf' || attachment.fileType === 'document') && (
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
                  {attachment.size ? `${(attachment.size / 1024).toFixed(2)} KB` : 'File'}
                </p>
                <div className="flex gap-3 mt-3">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                  >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    View
                  </a>
                  <a
                    href={fileUrl}
                    download={attachment.originalName}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
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
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto p-6 lg:p-10">
        {/* Back Button */}
        <button
          onClick={() => question ? navigate(`/questions/${question._id}`) : navigate(-1)}
          className="flex items-center gap-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary mb-6 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back to Question</span>
        </button>

        {/* Related Question Preview */}
        {question && (
          <div
            onClick={() => navigate(`/questions/${question._id}`)}
            className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 mb-6 cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">help</span>
              <span className="text-sm font-semibold text-text-light-secondary dark:text-text-dark-secondary">
                Question
              </span>
            </div>
            <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary mb-2">
              {question.title}
            </h2>
            <p className="text-text-light-secondary dark:text-text-dark-secondary line-clamp-2">
              {question.body || question.content}
            </p>
          </div>
        )}

        {/* Answer Card */}
        <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden">
          {/* Answer Header */}
          <div className="p-6 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <div className="flex items-start gap-4">
              <img
                src={
                  answer.author?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    answer.author?.name || "User"
                  )}&background=10b981&color=fff`
                }
                alt={answer.author?.name}
                className="w-16 h-16 rounded-full ring-4 ring-green-500/30"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
                    {answer.author?.name || "Anonymous"}
                  </h3>
                  {answer.author?.verified && (
                    <span
                      className="material-symbols-outlined text-blue-500 text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  )}
                  {answer.author?.role === "teacher" && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      TEACHER
                    </span>
                  )}
                  {answer.isAccepted && (
                    <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      ACCEPTED ANSWER
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-light-secondary dark:text-text-dark-secondary flex-wrap">
                  {answer.author?.school && (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">school</span>
                      <span>{answer.author.school}</span>
                    </div>
                  )}
                  {answer.author?.educationLevel && (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">workspace_premium</span>
                      <span>{answer.author.educationLevel}</span>
                    </div>
                  )}
                  {answer.author?.email && (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">mail</span>
                      <span>{answer.author.email}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-text-light-secondary dark:text-text-dark-secondary mt-2">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span>
                    {new Date(answer.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Answer Content */}
          <div className="p-8">
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <p className="text-text-light-primary dark:text-text-dark-primary leading-relaxed whitespace-pre-wrap text-lg">
                {answer.body || answer.content}
              </p>
            </div>

            {/* Answer Attachments */}
            {answer.attachments && answer.attachments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-primary">attach_file</span>
                  Attachments ({answer.attachments.length})
                </h3>
                <div className="space-y-4">
                  {answer.attachments.map((attachment, index) => 
                    renderAttachment(attachment, index)
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Answer Actions */}
          <div className="px-8 py-6 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleUpvote}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">thumb_up</span>
                  <span className="font-semibold">
                    {Array.isArray(answer.upvotes) ? answer.upvotes.length : answer.upvotes || 0}
                  </span>
                </button>
                <button
                  onClick={handleDownvote}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">thumb_down</span>
                  <span className="font-semibold">
                    {Array.isArray(answer.downvotes) ? answer.downvotes.length : answer.downvotes || 0}
                  </span>
                </button>
              </div>
              {answer.verifiedBy && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="font-semibold">
                    Verified by {answer.verifiedBy.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
