import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api";

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    school: user?.school || "",
    level: user?.level || "O-Level",
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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl w-full p-6 lg:p-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-text-light-primary dark:text-text-dark-primary">
              Profile & Settings
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
              Manage your profile, track progress, and configure your settings.
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
                  onClick={() => setIsEditing(false)}
                  className="flex items-center justify-center rounded-lg h-12 px-6 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary text-base font-bold leading-normal hover:bg-surface-light dark:hover:bg-surface-dark w-full md:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  <span className="material-symbols-outlined mr-2">save</span>
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </button>
              </>
            )}
            <button className="items-center justify-center rounded-lg h-12 w-12 border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-text-light-secondary hover:text-primary hidden md:flex">
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
                className="w-24 h-24 rounded-full mx-auto"
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    user?.name || "User"
                  }&size=128`
                }
              />
              <h2 className="text-xl font-bold mt-4">{user?.name || "User"}</h2>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                {user?.level || "O'Level"} Student
              </p>
              <div className="mt-4 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                <p>
                  Joined:{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {user?.questionsCount || 0}
                  </p>
                  <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                    Questions Asked
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {user?.answersCount || 0}
                  </p>
                  <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                    Answers Given
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{user?.points || 0}</p>
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
                      className="form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
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
                      className="form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* School */}
              <div className="border-t border-border-light dark:border-border-dark">
                <div className="flex flex-col md:flex-row p-6 gap-4">
                  <div className="md:w-1/3">
                    <h4 className="font-semibold">School</h4>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      Your current school.
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <input
                      className="form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="e.g., Kampala Secondary School"
                    />
                  </div>
                </div>
              </div>

              {/* Education Level */}
              <div className="border-t border-border-light dark:border-border-dark">
                <div className="flex flex-col md:flex-row p-6 gap-4">
                  <div className="md:w-1/3">
                    <h4 className="font-semibold">Education Level</h4>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      Your current education level.
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <select
                      className="form-select w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="O-Level">O'Level</option>
                      <option value="A-Level">A'Level</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Role Display */}
              <div className="border-t border-border-light dark:border-border-dark">
                <div className="flex flex-col md:flex-row p-6 gap-4">
                  <div className="md:w-1/3">
                    <h4 className="font-semibold">Account Role</h4>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      Your account type.
                    </p>
                  </div>
                  <div className="md:w-2/3">
                    <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold">
                      {user?.role === "Teacher" ? "Teacher" : "Student"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-black"></div>
            <div className="w-4 h-3 bg-yellow-400"></div>
            <div className="w-4 h-3 bg-red-600"></div>
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-text-light-secondary dark:text-text-dark-secondary">
            For God and My Country
          </p>
        </div>
      </div>
    </div>
  );
}
