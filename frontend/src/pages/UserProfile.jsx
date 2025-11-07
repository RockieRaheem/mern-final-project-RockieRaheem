import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api";

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    school: user?.school || "",
    level: user?.level || "S.3",
  });
  const [loading, setLoading] = useState(false);

  const achievements = [
    {
      icon: "school",
      color: "text-yellow-500",
      name: "Science Whiz",
      unlocked: true,
    },
    {
      icon: "local_fire_department",
      color: "text-green-500",
      name: "Streak Starter",
      unlocked: true,
    },
    {
      icon: "verified",
      color: "text-blue-500",
      name: "Top Contributor",
      unlocked: true,
    },
    {
      icon: "forum",
      color: "text-purple-500",
      name: "Community Helper",
      unlocked: true,
    },
    {
      icon: "lock",
      color: "text-text-light-secondary dark:text-text-dark-secondary",
      name: "Locked Badge",
      unlocked: false,
    },
    {
      icon: "lock",
      color: "text-text-light-secondary dark:text-text-dark-secondary",
      name: "Locked Badge",
      unlocked: false,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await api.auth.updateProfile(formData);
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed h-screen w-72 bg-card-light dark:bg-card-dark p-6 shadow-sm hidden lg:flex flex-col overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Uganda Flag */}
          <div className="flex flex-col items-center text-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-black"></div>
              <div className="w-4 h-3 bg-yellow-400"></div>
              <div className="w-4 h-3 bg-red-600"></div>
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-light-secondary dark:text-text-dark-secondary">
              For God and My Country
            </p>
          </div>

          {/* User Profile Section */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
                style={{
                  backgroundImage: `url(${
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      user?.name || "User"
                    }&size=128`
                  })`,
                }}
              ></div>
              <div className="flex flex-col">
                <h1 className="text-text-light-primary dark:text-text-dark-primary text-base font-bold leading-normal">
                  {user?.name || "John Doe"}
                </h1>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">
                  {user?.level || "O'Level"} Student
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 mt-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <p className="text-sm font-medium leading-normal">
                  Community Feed
                </p>
              </Link>
              <Link
                to="/my-questions"
                className="flex items-center gap-3 px-3 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">help_outline</span>
                <p className="text-sm font-medium leading-normal">
                  My Questions
                </p>
              </Link>
              <Link
                to="/sessions"
                className="flex items-center gap-3 px-3 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">groups</span>
                <p className="text-sm font-medium leading-normal">
                  Study Sessions
                </p>
              </Link>
              <Link
                to="/resources"
                className="flex items-center gap-3 px-3 py-2 text-text-light-secondary dark:text-text-dark-secondary hover:bg-surface-light dark:hover:bg-surface-dark rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">auto_stories</span>
                <p className="text-sm font-medium leading-normal">Resources</p>
              </Link>
            </nav>
          </div>

          {/* Settings at Bottom */}
          <div className="mt-auto">
            <div className="flex flex-col gap-1">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
              >
                <span className="material-symbols-outlined filled">
                  settings
                </span>
                <p className="text-sm font-semibold leading-normal">Settings</p>
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 lg:p-10">
        <div className="mx-auto max-w-7xl w-full">
          <div className="flex flex-col gap-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-text-light-primary dark:text-text-dark-primary text-4xl font-black leading-tight tracking-[-0.033em]">
                  Profile &amp; Settings
                </h1>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
                  Manage your profile, track progress, and configure your
                  settings.
                </p>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 w-full md:w-auto"
                  >
                    <span className="material-symbols-outlined mr-2">edit</span>
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          school: user?.school || "",
                          level: user?.level || "S.3",
                        });
                      }}
                      className="flex items-center justify-center rounded-lg h-12 px-6 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary text-base font-semibold leading-normal hover:bg-surface-light dark:hover:bg-surface-dark w-full md:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                    >
                      <span>Save Changes</span>
                    </button>
                  </>
                )}
                <button
                  onClick={toggleDarkMode}
                  className="items-center justify-center rounded-lg h-12 w-12 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-secondary hover:text-primary hidden md:flex"
                >
                  <span className="material-symbols-outlined">dark_mode</span>
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Summary */}
              <div className="lg:col-span-1 flex flex-col gap-8">
                {/* Profile Card */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark text-center">
                  <img
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${
                        user?.name || "User"
                      }&size=128`
                    }
                  />
                  <h2 className="text-xl font-bold mt-4">
                    {user?.name || "John Doe"}
                  </h2>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    {user?.level || "O'Level"} Student
                  </p>
                  <div className="mt-4 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    <p>
                      Joined:{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "January 15, 2023"}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {user?.questionsCount || 125}
                      </p>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        Questions Asked
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {user?.answersCount || 82}
                      </p>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        Answers Given
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {user?.points || "1.2k"}
                      </p>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        Points Earned
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achievements Card */}
                <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                  <h3 className="text-lg font-bold">Achievements</h3>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {achievements.map((achievement, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center"
                      >
                        <div
                          className={`flex items-center justify-center w-16 h-16 rounded-full bg-surface-light dark:bg-surface-dark ${
                            achievement.unlocked ? "" : "opacity-50"
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-4xl ${achievement.color}`}
                          >
                            {achievement.icon}
                          </span>
                        </div>
                        <p className="text-xs mt-2 font-medium">
                          {achievement.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                  <div className="p-6">
                    <h3 className="text-lg font-bold">Settings</h3>
                  </div>

                  {/* Full Name */}
                  <div className="border-t border-border-light dark:border-border-dark">
                    <div className="flex flex-col md:flex-row p-6 gap-4">
                      <div className="md:w-1/3">
                        <h4 className="font-semibold">Full Name</h4>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          Your legal name.
                        </p>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="border-t border-border-light dark:border-border-dark">
                    <div className="flex flex-col md:flex-row p-6 gap-4">
                      <div className="md:w-1/3">
                        <h4 className="font-semibold">Email Address</h4>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          Used for login and notifications.
                        </p>
                      </div>
                      <div className="md:w-2/3">
                        <input
                          className="form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dark Mode Toggle */}
                  <div className="border-t border-border-light dark:border-border-dark">
                    <div className="flex flex-col md:flex-row p-6 gap-4 items-center">
                      <div className="md:w-1/3">
                        <h4 className="font-semibold">Dark Mode</h4>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          Toggle between light and dark themes.
                        </p>
                      </div>
                      <div className="md:w-2/3 flex items-center">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            className="peer sr-only"
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                          />
                          <div className="peer h-6 w-11 rounded-full bg-border-light after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Education Level */}
                  <div className="border-t border-border-light dark:border-border-dark">
                    <div className="flex flex-col md:flex-row p-6 gap-4">
                      <div className="md:w-1/3">
                        <h4 className="font-semibold">Education Level</h4>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          Select your current level.
                        </p>
                      </div>
                      <div className="md:w-2/3">
                        <select
                          className="form-select w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5"
                          name="level"
                          value={formData.level}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="S.1">S.1</option>
                          <option value="S.2">S.2</option>
                          <option value="S.3">S.3</option>
                          <option value="S.4">S.4 (O'Level)</option>
                          <option value="S.5">S.5</option>
                          <option value="S.6">S.6 (A'Level)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button at Bottom */}
                  {isEditing && (
                    <div className="border-t border-border-light dark:border-border-dark p-6 flex justify-end">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{loading ? "Saving..." : "Save Changes"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Chatbot Button */}
      <button className="fixed bottom-6 right-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark">
        <span className="material-symbols-outlined text-4xl">smart_toy</span>
      </button>
    </div>
  );
}
