import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { questionAPI } from "../api";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    questionAPI
      .getAll({ limit: 10 })
      .then((res) => setQuestions(res.data.data))
      .catch(() => console.error("Failed to load questions"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Navigation */}
      <nav className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2.5 h-5 bg-black rounded-sm"></div>
                  <div className="w-2.5 h-5 bg-yellow-400 rounded-sm"></div>
                  <div className="w-2.5 h-5 bg-red-600 rounded-sm"></div>
                </div>
                <span className="font-bold text-xl text-text-light-primary dark:text-text-dark-primary">
                  Edulink
                </span>
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg"
                >
                  Community
                </Link>
                <Link
                  to="/sessions"
                  className="px-3 py-2 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Sessions
                </Link>
                <Link
                  to="/resources"
                  className="px-3 py-2 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Resources
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary hover:text-primary rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  person
                </span>
                <span className="hidden sm:inline">{user?.name}</span>
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">
              Community Feed
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
              Discover questions and answers from your fellow students.
            </p>
          </div>
          <Link
            to="/ask-question"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Ask Question</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-text-light-secondary dark:text-text-dark-secondary">
              Loading questions...
            </p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <span className="material-symbols-outlined text-5xl text-text-light-secondary dark:text-text-dark-secondary mb-3">
              forum
            </span>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">
              No questions yet. Be the first to ask!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Link
                key={question._id}
                to={`/questions/${question._id}`}
                className="block bg-card-light dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark hover:border-primary/50 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                        {question.subject}
                      </span>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300">
                        {question.educationLevel}
                      </span>
                      <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        · {new Date(question.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary mb-2">
                      {question.title}
                    </h3>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary line-clamp-2">
                      {question.body}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      <span>👤 {question.author?.name || "Anonymous"}</span>
                      <span>💬 {question.answers?.length || 0} answers</span>
                      <span>👁️ {question.views || 0} views</span>
                      <span>👍 {question.upvotes?.length || 0} upvotes</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
