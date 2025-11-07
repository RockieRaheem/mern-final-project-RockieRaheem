import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResourceLibrary() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedType, setSelectedType] = useState("All Types");

  const subjects = [
    "All Subjects",
    "Biology",
    "Physics",
    "Chemistry",
    "Mathematics",
    "English",
    "History",
  ];
  const types = ["All Types", "Study Notes", "Past Papers", "Verified Answer"];

  // Mock data
  const mockResources = [
    {
      _id: "1",
      title: "Calculating Projectile Motion",
      subject: "Physics",
      level: "A'Level",
      type: "Verified Answer",
      description:
        "Detailed derivation and worked example for projectile motion formula, including max height...",
      upvotes: 12,
    },
    {
      _id: "2",
      title: "Ionic vs. Covalent Bonds",
      subject: "Chemistry",
      level: "O'Level",
      type: "Verified Answer",
      description:
        "A clear breakdown of the differences between ionic (electron transfer) and covalent (electron sharing) bonds.",
      upvotes: 28,
    },
    {
      _id: "3",
      title: "The Process of Mitosis",
      subject: "Biology",
      level: "O'Level",
      type: "Study Notes",
      description:
        "A simplified explanation of all stages (Prophase, Metaphase, Anaphase, Telophase) with diagrams.",
      upvotes: 8,
    },
    {
      _id: "4",
      title: "2023 Mathematics Past Paper",
      subject: "Mathematics",
      level: "A'Level",
      type: "Past Papers",
      description:
        "Complete UNEB Mathematics past paper from 2023 with solutions.",
      upvotes: 45,
    },
    {
      _id: "5",
      title: "Organic Chemistry Notes",
      subject: "Chemistry",
      level: "A'Level",
      type: "Study Notes",
      description:
        "Comprehensive notes on organic chemistry nomenclature and reactions.",
      upvotes: 19,
    },
    {
      _id: "6",
      title: "Newton's Laws Explained",
      subject: "Physics",
      level: "O'Level",
      type: "Study Notes",
      description:
        "Easy-to-understand explanation of all three Newton's laws with real-world examples.",
      upvotes: 31,
    },
  ];

  useEffect(() => {
    // In real app, fetch from API
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "All Subjects" ||
      resource.subject === selectedSubject;
    const matchesType =
      selectedType === "All Types" || resource.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  const getSubjectColor = (subject) => {
    const colors = {
      Physics:
        "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300",
      Chemistry:
        "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300",
      Biology: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300",
      Mathematics:
        "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300",
      English:
        "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300",
      History:
        "bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-300",
    };
    return (
      colors[subject] ||
      "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300"
    );
  };

  const getLevelColor = (level) => {
    return level === "O'Level"
      ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
      : "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300";
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-7xl w-full p-6 lg:p-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-text-light-primary dark:text-text-dark-primary">
              Resource Library
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
              Explore study notes, past papers, and verified answers.
            </p>
          </div>
          <button className="flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 w-full md:w-auto">
            <span className="material-symbols-outlined mr-2">upload_file</span>
            <span>Upload a Resource</span>
          </button>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-light-secondary dark:text-text-dark-secondary">
              search
            </span>
            <input
              className="form-input w-full rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-3.5 pl-12 pr-4 text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search for topics, past papers..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              className="form-select w-full md:w-48 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-3.5 pl-4 pr-10 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <select
              className="form-select w-full md:w-48 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark py-3.5 pl-4 pr-10 text-text-light-primary dark:text-text-dark-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resources Grid */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
              {selectedType === "All Types" ? "All Resources" : selectedType}
            </h2>
            {selectedType === "Verified Answer" && (
              <span className="material-symbols-outlined text-green-500 filled">
                verified
              </span>
            )}
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/resources/${resource._id}`)}
                >
                  <div className="p-5 flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getSubjectColor(
                          resource.subject
                        )}`}
                      >
                        {resource.subject}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getLevelColor(
                          resource.level
                        )}`}
                      >
                        {resource.level}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <h3 className="font-bold text-text-light-primary dark:text-text-dark-primary flex-1">
                        {resource.title}
                      </h3>
                      {resource.type === "Verified Answer" && (
                        <span className="material-symbols-outlined text-green-500 filled text-lg flex-shrink-0">
                          verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1 text-text-light-secondary dark:text-text-dark-secondary line-clamp-2">
                      {resource.description}
                    </p>
                  </div>
                  <div className="bg-surface-light dark:bg-surface-dark px-5 py-3 border-t border-border-light dark:border-border-dark flex items-center justify-between text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">
                        thumb_up
                      </span>
                      <span>{resource.upvotes}</span>
                    </div>
                    <span className="font-semibold text-primary group-hover:underline">
                      View{" "}
                      {resource.type === "Verified Answer"
                        ? "Answer"
                        : resource.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card-light dark:bg-card-dark p-12 rounded-xl text-center border border-border-light dark:border-border-dark">
              <span className="material-symbols-outlined text-5xl text-text-light-secondary dark:text-text-dark-secondary mb-3">
                search_off
              </span>
              <p className="text-text-light-secondary dark:text-text-dark-secondary">
                No resources found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* Uganda Flag Footer */}
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
