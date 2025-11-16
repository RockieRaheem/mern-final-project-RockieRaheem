import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AskQuestion() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subject: "",
    educationLevel: "A-Level",
  });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subjects = [
    "Biology",
    "Physics",
    "Chemistry",
    "Mathematics",
    "English",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Literature",
  ];

  const educationLevels = [
    "Primary",
    "O-Level",
    "A-Level",
    "Undergraduate",
    "Postgraduate",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleRemoveFile = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a question title");
      return;
    }

    if (!formData.content.trim()) {
      setError("Please provide question details");
      return;
    }

    if (!formData.subject) {
      setError("Please select a subject");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("body", formData.content);
      submitData.append("subject", formData.subject);
      submitData.append("educationLevel", formData.educationLevel);

      console.log("========== SUBMITTING QUESTION ==========");
      console.log("Attachments to upload:", attachments);

      // Append multiple images
      attachments.forEach((file, index) => {
        console.log(
          `Appending file ${index}:`,
          file.name,
          file.type,
          file.size
        );
        submitData.append("images", file);
      });

      // Log all FormData entries
      console.log("FormData contents:");
      for (let [key, value] of submitData.entries()) {
        console.log(`  ${key}:`, value);
      }
      console.log("=======================================");

      const response = await api.questions.create(submitData);
      const newId = response.data.data?._id || response.data._id;
      if (newId) {
        navigate(`/questions/${newId}`);
      } else {
        setError("Question created but could not get ID.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex w-24 mb-3">
            <div className="w-1/3 bg-black h-1"></div>
            <div className="w-1/3 bg-yellow-400 h-1"></div>
            <div className="w-1/3 bg-red-600 h-1"></div>
          </div>
          <h1 className="text-text-light-primary dark:text-text-dark-primary text-3xl sm:text-4xl font-black tracking-tighter">
            Ask the Community
          </h1>
          <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2 max-w-md">
            Share your question and let fellow students and tutors help you out.
            Be clear and provide as much detail as possible.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card-light dark:bg-card-dark p-6 sm:p-8 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Question Title */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary"
                htmlFor="title"
              >
                Question Title
              </label>
              <input
                className="form-input w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 px-4 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="title"
                name="title"
                placeholder="e.g., How to solve quadratic equations?"
                type="text"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* Question Details */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary"
                htmlFor="content"
              >
                Details
              </label>
              <textarea
                className="form-textarea w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 px-4 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                id="content"
                name="content"
                placeholder="Explain your question in more detail. What have you tried so far?"
                rows="6"
                value={formData.content}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">
                Add Images (Optional)
              </label>
              <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mb-2">
                Upload up to 3 images (photos of your work, diagrams, etc.)
              </p>
              <div className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-4xl text-text-light-secondary dark:text-text-dark-secondary">
                  add_photo_alternate
                </span>
                <p className="mt-2 text-sm text-text-light-secondary dark:text-text-dark-secondary">
                  <span className="font-semibold text-primary">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-text-light-secondary/70 dark:text-text-dark-secondary/70">
                  PNG, JPG, JPEG (Max 3 images)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Image Preview */}
              {attachments.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {attachments.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg border border-border-light dark:border-border-dark"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subject and Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary"
                  htmlFor="subject"
                >
                  Subject
                </label>
                <select
                  className="form-select w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 pl-4 pr-10 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Education Level */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary"
                  htmlFor="educationLevel"
                >
                  Education Level
                </label>
                <select
                  className="form-select w-full rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark py-2.5 pl-4 pr-10 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                >
                  {educationLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-border-light dark:border-border-dark pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-text-light-secondary dark:text-text-dark-secondary order-2 sm:order-1">
                For God and My Country
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-light dark:focus:ring-offset-card-dark focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2">send</span>
                    <span>Submit Question</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
