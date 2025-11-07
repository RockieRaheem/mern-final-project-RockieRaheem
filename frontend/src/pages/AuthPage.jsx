import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    school: "",
    district: "",
    subjects: [],
    educationLevel: "O-Level",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (activeTab === "login") {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark">
      <main className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-6 h-4 bg-black"></div>
            <div className="w-6 h-4 bg-yellow-400"></div>
            <div className="w-6 h-4 bg-red-600"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-light-primary dark:text-text-dark-primary">
            Edulink
          </h1>
          <p className="text-sm font-medium tracking-widest uppercase text-text-light-secondary dark:text-text-dark-secondary mt-1">
            For God and My Country
          </p>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark">
          <div className="p-2 bg-surface-light dark:bg-surface-dark rounded-t-xl">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab("login")}
                className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === "login"
                    ? "bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary shadow-sm"
                    : "text-text-light-secondary dark:text-text-dark-secondary"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === "signup"
                    ? "bg-card-light dark:bg-card-dark text-text-light-primary dark:text-text-dark-primary shadow-sm"
                    : "text-text-light-secondary dark:text-text-dark-secondary"
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {activeTab === "login" ? (
                <>
                  <h2 className="text-2xl font-bold text-center text-text-light-primary dark:text-text-dark-primary">
                    Welcome Back!
                  </h2>

                  <div>
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-3 px-4 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-3 px-4 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center text-text-light-primary dark:text-text-dark-primary">
                    Join Edulink
                  </h2>

                  <div>
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 px-4 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 px-4 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                        School
                      </label>
                      <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 px-4 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 px-4 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="mt-1 w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 px-4 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
