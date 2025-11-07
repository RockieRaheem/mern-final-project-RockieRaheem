import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const MyQuestions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for filters
  const [filters, setFilters] = useState({
    subject: "All Subjects",
    timeAsked: "Any Time",
    status: "All Statuses",
  });

  // Mock questions data - replace with actual API call
  const [questions] = useState([
    {
      id: 1,
      title:
        "What is the escape velocity of an object from Earth's gravitational pull?",
      description:
        "I'm struggling to understand the derivation of the escape velocity formula. Could someone explain the key steps involved and how it relates to potential and kinetic energy? I've seen the formula v = sqrt(2GM/R) but I'm not sure where it comes from...",
      subject: "Physics",
      status: "Verified",
      statusBgClass: "bg-verified/10",
      statusTextClass: "text-verified",
      statusIcon: "verified",
      timeAgo: "2 days ago",
      askedBy: "You",
    },
    {
      id: 2,
      title: "How do you solve a system of linear equations using matrices?",
      description:
        "I understand how to set up the augmented matrix, but I get confused with the row reduction steps. Is there a systematic way to approach it to avoid errors? Specifically, when should I swap rows versus multiplying a row by a constant?",
      subject: "Mathematics",
      status: "Answered",
      statusBgClass: "bg-success/10",
      statusTextClass: "text-success",
      statusIcon: "check_circle",
      timeAgo: "1 week ago",
      askedBy: "You",
    },
    {
      id: 3,
      title: "What is the difference between an ionic and a covalent bond?",
      description:
        "I know one involves sharing electrons and the other involves transferring them, but I'm looking for a deeper explanation. How does electronegativity play a role in determining the type of bond that forms between two atoms?",
      subject: "Chemistry",
      status: "In Discussion",
      statusBgClass: "bg-info/10",
      statusTextClass: "text-info",
      statusIcon: "forum",
      timeAgo: "2 weeks ago",
      askedBy: "You",
    },
    {
      id: 4,
      title: "Can someone explain the process of mitosis in simple terms?",
      description:
        "I need to remember the different phases (Prophase, Metaphase, Anaphase, Telophase) and what happens in each. A simple analogy or a diagram would be very helpful. I am preparing for my final exams and this topic is crucial.",
      subject: "Biology",
      status: "Pending",
      statusBgClass: "bg-warning/10",
      statusTextClass: "text-warning",
      statusIcon: "pending",
      timeAgo: "1 month ago",
      askedBy: "You",
    },
  ]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const applyFilters = () => {
    // Implement filter logic here
    console.log("Applying filters:", filters);
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/questions/${questionId}`);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="flex h-screen w-full flex-col">
        {/* Header */}
        <header className="flex h-20 flex-shrink-0 items-center justify-between border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Uganda Flag */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-black"></div>
              <div className="w-4 h-3 bg-yellow-400"></div>
              <div className="w-4 h-3 bg-red-600"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold">My Questions</h1>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Track and manage all your academic inquiries.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark transition-colors">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
            <img
              alt="User avatar"
              className="h-10 w-10 rounded-full object-cover"
              src={
                user?.avatar ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAHiyrU29vWFdRfu2THrcdJ9DuKRRigHZrZRRCZ3Fx63sDxfTh59DohoXuNttkTkkktAskwGwRrOKu7bxrTXYSDbHLcgAmQNsF1-DmcRd1Ha1os3y_9HuUUMuqm0zW-1MgF0zMKUlGh2b7D7sgKlz78N38_IBZ54M_XuDZRZBhJ1gii5g8ZcacgtIIzLl8B7LXqR9qYlx1OdtccUrD1umJkHPMYL7DkYJj0xUH-36_UlYjTI8diSWSOjcJ1gls00KWeMJqqMaMm8fE"
              }
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-6">
              {/* Filter Section */}
              <div className="p-4 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Subject Filter */}
                  <div>
                    <label
                      className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1"
                      htmlFor="subject-filter"
                    >
                      Subject
                    </label>
                    <select
                      className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus:border-primary focus:ring-primary/50 text-text-light-primary dark:text-text-dark-primary"
                      id="subject-filter"
                      value={filters.subject}
                      onChange={(e) =>
                        handleFilterChange("subject", e.target.value)
                      }
                    >
                      <option>All Subjects</option>
                      <option>Physics</option>
                      <option>Mathematics</option>
                      <option>Chemistry</option>
                      <option>Biology</option>
                    </select>
                  </div>

                  {/* Time Filter */}
                  <div>
                    <label
                      className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1"
                      htmlFor="time-filter"
                    >
                      Time Asked
                    </label>
                    <select
                      className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus:border-primary focus:ring-primary/50 text-text-light-primary dark:text-text-dark-primary"
                      id="time-filter"
                      value={filters.timeAsked}
                      onChange={(e) =>
                        handleFilterChange("timeAsked", e.target.value)
                      }
                    >
                      <option>Any Time</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label
                      className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1"
                      htmlFor="status-filter"
                    >
                      Status
                    </label>
                    <select
                      className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark focus:border-primary focus:ring-primary/50 text-text-light-primary dark:text-text-dark-primary"
                      id="status-filter"
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option>All Statuses</option>
                      <option>Answered</option>
                      <option>In Discussion</option>
                      <option>Pending</option>
                      <option>Verified</option>
                    </select>
                  </div>

                  {/* Apply Button */}
                  <div className="flex items-end">
                    <button
                      onClick={applyFilters}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">
                        filter_alt
                      </span>
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    onClick={() => handleQuestionClick(question.id)}
                    className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 transition-shadow hover:shadow-md cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full ${question.statusBgClass} px-2 py-0.5 text-xs font-medium ${question.statusTextClass}`}
                          >
                            <span className="material-symbols-outlined text-sm filled">
                              {question.statusIcon}
                            </span>
                            {question.status}
                          </span>
                          <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                            •
                          </span>
                          <span className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                            {question.subject}
                          </span>
                        </div>
                        <p className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">
                          {question.title}
                        </p>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          {question.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-left sm:text-right">
                        <p className="text-sm font-medium">
                          Asked {question.timeAgo}
                        </p>
                        <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                          by {question.askedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-center pt-4">
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                  For God and My Country
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Floating Chatbot Button */}
        <button className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark">
          <span className="material-symbols-outlined text-4xl">smart_toy</span>
        </button>
      </div>
    </div>
  );
};

export default MyQuestions;
