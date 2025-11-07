import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { questionAPI } from "../api";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const { user, logout } = useAuth();

  useEffect(() => {
    questionAPI
      .getAll({ limit: 10 })
      .then((res) => setQuestions(res.data.data))
      .catch(() => console.error("Failed to load questions"))
      .finally(() => setLoading(false));
  }, []);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "All Subjects" || q.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2.5 h-5 bg-black rounded-sm"></div>
              <div className="w-2.5 h-5 bg-yellow-400 rounded-sm"></div>
              <div className="w-2.5 h-5 bg-red-600 rounded-sm"></div>
            </div>
            <span className="font-bold text-xl tracking-tight text-text-light-primary dark:text-text-dark-primary">
              Edulink
            </span>
          </div>
          <button
            onClick={logout}
            className="text-text-light-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="flex-shrink-0 w-64 bg-card-light dark:bg-card-dark hidden lg:flex flex-col border-r border-border-light dark:border-border-dark fixed h-screen overflow-y-auto">
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-2.5 h-5 bg-black rounded-sm"></div>
              <div className="w-2.5 h-5 bg-yellow-400 rounded-sm"></div>
              <div className="w-2.5 h-5 bg-red-600 rounded-sm"></div>
            </div>
            <span className="font-bold text-xl tracking-tight text-text-light-primary dark:text-text-dark-primary">
              Edulink
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-10 flex-shrink-0">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary-light dark:bg-primary/20 text-primary dark:text-white"
            >
              <span className="material-symbols-outlined filled">forum</span>
              <p className="text-sm font-semibold leading-normal">
                Community Feed
              </p>
            </Link>
            <Link
              to="/ask-question"
              className="flex items-center gap-3 px-3 py-2.5 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg"
            >
              <span className="material-symbols-outlined">help_outline</span>
              <p className="text-sm font-medium leading-normal">My Questions</p>
            </Link>
            <Link
              to="/sessions"
              className="flex items-center gap-3 px-3 py-2.5 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg"
            >
              <span className="material-symbols-outlined">groups</span>
              <p className="text-sm font-medium leading-normal">
                Study Sessions
              </p>
            </Link>
            <Link
              to="/resources"
              className="flex items-center gap-3 px-3 py-2.5 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg"
            >
              <span className="material-symbols-outlined">auto_stories</span>
              <p className="text-sm font-medium leading-normal">Resources</p>
            </Link>
          </nav>

          {/* Footer Section */}
          <div className="mt-auto pt-6 border-t border-border-light dark:border-border-dark flex-shrink-0">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold tracking-widest uppercase text-text-light-secondary dark:text-text-dark-secondary text-center mb-3">
                For God and My Country
              </p>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2.5 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg"
              >
                <span className="material-symbols-outlined">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </Link>

              {/* User Profile */}
              <div className="flex gap-3 items-center mt-4 px-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full size-10 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col flex-1">
                  <h1 className="text-text-light-primary dark:text-text-dark-primary text-sm font-semibold leading-normal truncate">
                    {user?.name || "User"}
                  </h1>
                  <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-normal leading-normal">
                    {user?.educationLevel || "Student"}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="text-text-light-secondary dark:text-text-dark-secondary hover:text-red-600 dark:hover:text-red-400"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-xl">
                    logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen bg-background-light dark:bg-background-dark pt-16 lg:pt-0">
        <div className="p-6 lg:p-10">
          <div className="mx-auto max-w-4xl w-full">
            <div className="flex flex-col gap-8">
              {/* Header */}
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-text-light-primary dark:text-text-dark-primary text-3xl font-bold tracking-tight">
                    Community Feed
                  </h1>
                  <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
                    Discover questions and answers from your fellow students.
                  </p>
                </div>
                <Link
                  to="/ask-question"
                  className="flex items-center justify-center rounded-lg h-11 px-5 bg-primary text-white text-sm font-semibold leading-normal shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:bg-gray-300 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  <span className="material-symbols-outlined mr-2 !text-xl">
                    add_circle
                  </span>
                  <span>Ask a Question</span>
                </Link>
              </header>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-3 pl-12 pr-4 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Search questions, topics, or subjects..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="form-select w-full md:w-44 rounded-lg border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-3 pl-4 pr-10 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                  >
                    <option>All Subjects</option>
                    <option>Biology</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Mathematics</option>
                    <option>English</option>
                    <option>Geography</option>
                    <option>History</option>
                  </select>
                  <button className="flex-shrink-0 flex items-center justify-center rounded-lg h-[46px] w-[46px] border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-secondary hover:text-primary dark:hover:text-white">
                    <span className="material-symbols-outlined">tune</span>
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="flex flex-col gap-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-2 text-text-light-secondary dark:text-text-dark-secondary">
                      Loading questions...
                    </p>
                  </div>
                ) : filteredQuestions.length === 0 ? (
                  <div className="text-center py-12 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
                    <span className="material-symbols-outlined text-5xl text-text-light-secondary dark:text-text-dark-secondary mb-3">
                      forum
                    </span>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary">
                      {searchQuery || selectedSubject !== "All Subjects"
                        ? "No questions found matching your criteria."
                        : "No questions yet. Be the first to ask!"}
                    </p>
                  </div>
                ) : (
                  filteredQuestions.map((question) => (
                    <div
                      key={question._id}
                      className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-subtle border border-border-light dark:border-border-dark hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* User Avatar */}
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-full size-10 flex-shrink-0 flex items-center justify-center text-white font-semibold">
                          {question.author?.name?.charAt(0) || "A"}
                        </div>

                        <div className="flex-1">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                                {question.author?.name || "Anonymous"}
                              </p>
                              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                                ·{" "}
                                {new Date(
                                  question.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                                {question.subject}
                              </span>
                              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300">
                                {question.educationLevel}
                              </span>
                            </div>
                          </div>

                          {/* Question Content */}
                          <Link to={`/questions/${question._id}`}>
                            <h3 className="text-lg font-semibold mt-2 text-text-light-primary dark:text-text-dark-primary leading-snug hover:text-primary transition-colors">
                              {question.title}
                            </h3>
                            <p className="mt-2 text-text-light-secondary dark:text-text-dark-secondary text-sm leading-relaxed line-clamp-2">
                              {question.body}
                            </p>
                          </Link>

                          {/* Question Image if exists */}
                          {question.image && (
                            <img
                              src={question.image}
                              alt="Question attachment"
                              className="mt-4 rounded-lg w-full h-auto max-h-80 object-cover border border-border-light dark:border-border-dark"
                            />
                          )}

                          {/* Actions */}
                          <div className="mt-5 flex items-center justify-between text-text-light-secondary dark:text-text-dark-secondary">
                            <div className="flex items-center gap-5">
                              <button className="flex items-center gap-1.5 hover:text-primary dark:hover:text-primary-light transition-colors">
                                <span className="material-symbols-outlined text-xl">
                                  thumb_up
                                </span>
                                <span className="text-sm font-medium">
                                  {question.upvotes?.length || 0}
                                </span>
                              </button>
                              <Link
                                to={`/questions/${question._id}`}
                                className="flex items-center gap-1.5 hover:text-primary dark:hover:text-primary-light transition-colors"
                              >
                                <span className="material-symbols-outlined text-xl">
                                  chat_bubble_outline
                                </span>
                                <span className="text-sm font-medium">
                                  {question.answers?.length || 0} Answers
                                </span>
                              </Link>
                            </div>
                            <button className="flex items-center gap-1.5 hover:text-primary dark:hover:text-primary-light transition-colors">
                              <span className="material-symbols-outlined text-xl">
                                bookmark_border
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Chatbot Button */}
      <button className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark lg:hidden">
        <span className="material-symbols-outlined text-3xl">smart_toy</span>
      </button>
    </div>
  );
};

export default Dashboard;
