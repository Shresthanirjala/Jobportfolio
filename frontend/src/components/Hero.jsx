import React, { useState, useEffect } from "react";
// Remove AuthContext related imports
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

import { useSelector } from "react-redux"; // Import Redux useSelector hook
import ApplyForm from "../pages/ApplyForm";
import {
  Search,
  MapPin,
  Briefcase,
  TrendingUp,
  Sparkles,
  Star,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Filter,
  Heart,
} from "lucide-react";
import { BASE_URL } from "../config/config";

const Hero = ({ jobs = [] }) => {
  // Use useSelector to get user and isAuthenticated state from the Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJobId, setApplyJobId] = useState(null);
  const [applyJobTitle, setApplyJobTitle] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    // Fetch applied jobs for the user (if logged in)
    const fetchAppliedJobs = async () => {
      // Check for both isAuthenticated and user existence
      if (isAuthenticated && user && user.token) {
        try {
          const res = await fetch(
            `${BASE_URL}/api/v1/application/my-applications`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          const data = await res.json();
          // Ensure data.applications is an array before mapping
          if (Array.isArray(data.applications)) {
            setAppliedJobIds(data.applications.map((app) => app.jobId));
          } else {
            setAppliedJobIds([]);
          }
        } catch (err) {
          console.error("Failed to fetch applied jobs:", err); // Log the error for debugging
          setAppliedJobIds([]); // Clear applied jobs on error
        }
      } else {
        setAppliedJobIds([]); // Clear applied jobs if user is not logged in
      }
    };
    fetchAppliedJobs();
  }, [isAuthenticated, user]); // Dependencies for useEffect: re-run when isAuthenticated or user changes

  const handleApply = (jobId, jobTitle) => {
    // Get token from the Redux user object
    const token = user?.token || localStorage.getItem("authToken"); // Fallback to localStorage for compatibility, though Redux user.token is preferred

    if (token) {
      if (appliedJobIds.includes(jobId)) {
        window.alert("You already applied to this job.");
        return;
      }
      setApplyJobId(jobId);
      setApplyJobTitle(jobTitle);
      setShowApplyModal(true);
    } else {
      window.alert("Please log in to apply for jobs.");
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set()); // Consider moving saved jobs to Redux if it's a global state

  // This is a local state for filter display, not necessarily needing Redux
  const [showFilters, setShowFilters] = useState(false);
  const [animatedText, setAnimatedText] = useState("");

  const trendingSearches = [
    { title: "UiUx Designer", count: "1.2k+ jobs" },
    { title: "ML Engineer", count: "3.5k+ jobs" },
    { title: "App developers", count: "2.1k+ jobs" },
    { title: "Backend Developer", count: "1.8k+ jobs" },
    { title: "QA Engineer", count: "950+ jobs" },
  ];

  // Animated typing effect (no changes needed for Redux migration)
  const phrases = [
    "Your Dream Job",
    "Perfect Opportunity",
    "Career Growth",
    "Next Position",
  ];
  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (isDeleting) {
        setAnimatedText(currentPhrase.substring(0, currentCharIndex - 1));
        currentCharIndex--;
      } else {
        setAnimatedText(currentPhrase.substring(0, currentCharIndex + 1));
        currentCharIndex++;
      }

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        setTimeout(() => (isDeleting = true), 2000);
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      }

      setTimeout(typeWriter, isDeleting ? 50 : 150);
    };

    typeWriter();
  }, []);

  // Search bar functionality: filter jobs by query and location (no changes needed for Redux migration)
  const handleSearch = () => {
    if (!searchQuery.trim() && !location.trim()) return;
    setIsSearching(true);
    const normalizedSearch = searchQuery.toLowerCase().replace(/\s+/g, "");
    const normalizedLocation = location.toLowerCase().replace(/\s+/g, "");
    const filteredJobs = jobs.filter((job) => {
      const titleMatch =
        job.title &&
        job.title.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch);
      const companyMatch =
        job.companyName &&
        job.companyName
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(normalizedSearch);
      const skillsMatch =
        Array.isArray(job.skills) &&
        job.skills.some((skill) =>
          skill.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch)
        );
      const locationMatch =
        location.trim() === "" ||
        (job.location &&
          job.location
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(normalizedLocation));
      return (titleMatch || companyMatch || skillsMatch) && locationMatch;
    });
    setSearchResults(filteredJobs);
    setIsSearching(false);
  };

  const handleTrendingClick = async (searchTerm) => {
    setSearchQuery(searchTerm);
    setLocation("");
    setIsSearching(true);
    // Normalize both job title, skills, and search term for flexible matching
    const normalizedSearch = searchTerm.toLowerCase().replace(/\s+/g, "");
    const filteredJobs = jobs.filter((job) => {
      const titleMatch =
        job.title &&
        job.title.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch);
      const skillsMatch =
        Array.isArray(job.skills) &&
        job.skills.some((skill) =>
          skill.toLowerCase().replace(/\s+/g, "").includes(normalizedSearch)
        );
      return titleMatch || skillsMatch;
    });
    setSearchResults(filteredJobs);
    setIsSearching(false);
  };

  const toggleSaveJob = (jobId) => {
    // If saved jobs state needs to persist across sessions or components,
    // consider making it a Redux state as well, and dispatching actions to update it.
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 relative overflow-hidden">
      {/* Subtle Decorative Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-[#718B68] opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-[#013954] opacity-5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 left-20 w-28 h-28 bg-[#718B68] opacity-5 rounded-full blur-2xl"></div>

      <div className="relative z-10 flex flex-col gap-12 justify-center items-center px-4 md:px-10 pt-24 py-[100px]">
        <div className="w-full max-w-[1000px]">
          {/* Professional Header Section */}
          <div className="text-[#013954] text-center p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-2 bg-[#718B68] rounded-lg">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-[#718B68] font-semibold text-sm uppercase tracking-wide">
                Professional Job Search
              </span>
            </div>

            <h1 className="text-[36px] md:text-[52px] font-bold leading-tight mb-6 text-[#013954]">
              Find{" "}
              <span className="text-[#718B68] relative inline-block">
                {animatedText}
                <span className="animate-pulse text-[#718B68]">|</span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#718B68]"></div>
              </span>
              <br className="hidden md:block" />
              With Confidence
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connect with leading employers and discover career opportunities
              that align with your expertise and professional goals.
            </p>
          </div>

          {/* Professional Search Bar Section */}
          <div className="flex flex-col items-center gap-6 mb-8">
            {/* Search Input Container */}
            <div className="rounded-2xl p-6 w-full max-w-4xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Search Input */}
                <div className="flex items-center gap-4 w-full lg:flex-1">
                  <div className="p-3 bg-[#013954] rounded-lg">
                    <Search className="text-white w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search jobs, companies, skills..."
                    className="bg-transparent outline-none text-gray-700 w-full text-lg placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-[1px] bg-gray-200 h-12"></div>
                <div className="lg:hidden w-full h-[1px] bg-gray-200"></div>

                {/* Location Input */}
                <div className="flex items-center gap-4 w-full lg:flex-1">
                  <div className="p-3 bg-[#718B68] rounded-lg">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    className="bg-transparent outline-none text-gray-700 w-full text-lg placeholder-gray-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Professional Search Button */}
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="rounded-xl w-full max-w-xs h-14 bg-[#718B68] shadow-lg text-white flex items-center justify-center text-lg font-semibold hover:bg-[#5d7355] transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSearching ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5" />
                  <span>Search Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Professional Trending Searches */}
        <div className="w-full max-w-[1000px] text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-[#013954] rounded-lg">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-[#013954]">
              Popular Job Categories
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleTrendingClick(search.title)}
                className="group p-5 bg-white border border-gray-200 rounded-xl hover:border-[#718B68] hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#718B68] group-hover:bg-opacity-10 rounded-lg flex items-center justify-center mb-3 mx-auto transition-all duration-300">
                    <Briefcase className="w-6 h-6 text-gray-600 group-hover:text-[#718B68]" />
                  </div>
                  <h4 className="font-semibold text-[#013954] mb-1 group-hover:text-[#718B68] transition-colors">
                    {search.title}
                  </h4>
                  <p className="text-sm text-gray-500">{search.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Professional Search Results Section */}
        {searchResults.length > 0 && (
          <div className="w-full max-w-[1000px] mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#013954] rounded-lg">
                    <Briefcase className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#013954]">
                      Search Results
                    </h2>
                    <p className="text-[#718B68] font-medium">
                      {searchResults.length} positions found
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Sort by</p>
                  <select className="bg-transparent border-b border-gray-300 text-gray-700 font-medium focus:outline-none focus:border-[#718B68]">
                    <option>Relevance</option>
                    <option>Date Posted</option>
                    <option>Salary</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6">
                {searchResults.map((job, index) => (
                  <div
                    key={job._id}
                    className="group p-6 border border-gray-200 rounded-xl hover:border-[#718B68] hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-gray-100 group-hover:bg-[#718B68] group-hover:bg-opacity-10 rounded-lg transition-all">
                            <Briefcase className="w-6 h-6 text-gray-600 group-hover:text-[#718B68]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#013954] mb-2 group-hover:text-[#718B68] transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                              <span className="flex items-center gap-2 font-medium">
                                <div className="w-2 h-2 bg-[#718B68] rounded-full"></div>
                                {job.companyName}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.jobPostedOn
                                  ? new Date(
                                      job.jobPostedOn
                                    ).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {job.introduction || "No description available"}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(job.skills ?? []).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            {/* Responsibilities & Qualifications (fixed height, scrollable) */}
                            {(job.responsibilities || job.qualifications) && (
                              <div
                                className="flex flex-wrap gap-3 mt-2"
                                style={{ maxHeight: "90px", overflowY: "auto" }}
                              >
                                {job.responsibilities && (
                                  <div
                                    className="flex-1 min-w-[120px] bg-gray-50 border border-gray-100 rounded-xl p-2"
                                    style={{
                                      maxHeight: "90px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    <h4 className="font-semibold text-[#013954] mb-1 flex items-center gap-2 text-xs">
                                      <span className="w-2 h-2 bg-[#718B68] rounded-full"></span>
                                      Responsibilities
                                    </h4>
                                    <ul className="list-disc pl-4 text-gray-700 text-xs space-y-1">
                                      {job.responsibilities
                                        .split(/,\s*/)
                                        .map((item, idx) => (
                                          <li key={idx}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                                {job.qualifications && (
                                  <div
                                    className="flex-1 min-w-[120px] bg-gray-50 border border-gray-100 rounded-xl p-2"
                                    style={{
                                      maxHeight: "90px",
                                      overflowY: "auto",
                                    }}
                                  >
                                    <h4 className="font-semibold text-[#013954] mb-1 flex items-center gap-2 text-xs">
                                      <span className="w-2 h-2 bg-[#718B68] rounded-full"></span>
                                      Qualifications
                                    </h4>
                                    <ul className="list-disc pl-4 text-gray-700 text-xs space-y-1">
                                      {job.qualifications
                                        .split(/,\s*/)
                                        .map((item, idx) => (
                                          <li key={idx}>{item.trim()}</li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            {job.jobType}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-4 justify-between h-full">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xl font-bold text-[#718B68] mb-1">
                            <DollarSign className="w-5 h-5" />
                            {job.salary}
                          </div>
                          <p className="text-sm text-gray-500">per year</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => toggleSaveJob(job._id)}
                            className={`p-3 rounded-lg transition-all duration-300 ${
                              savedJobs.has(job._id)
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                savedJobs.has(job._id) ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 text-xs ${
                              appliedJobIds.includes(job._id)
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#013954] text-white hover:bg-[#025373]"
                            }`}
                            onClick={() => {
                              // Re-check appliedJobIds before calling handleApply
                              // This ensures the button's disabled state is respected
                              if (!appliedJobIds.includes(job._id)) {
                                handleApply(job._id, job.title);
                              } else {
                                window.alert(
                                  "You already applied to this job."
                                );
                              }
                            }}
                            disabled={appliedJobIds.includes(job._id)}
                          >
                            {appliedJobIds.includes(job._id)
                              ? "Already Applied"
                              : "Apply Now"}
                            {!appliedJobIds.includes(job._id) && (
                              <ArrowRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {/* Modal for ApplyForm */}
                        {showApplyModal && (
                          <div className="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                            <div className="modal-content bg-white p-6 rounded-lg shadow-lg relative w-full max-w-lg">
                              <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowApplyModal(false)}
                              >
                                &times;
                              </button>
                              <ApplyForm
                                jobId={applyJobId}
                                jobTitle={applyJobTitle}
                                appliedJobIds={appliedJobIds}
                                onClose={() => setShowApplyModal(false)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Professional No Results Message */}
        {searchResults.length === 0 && searchQuery && !isSearching && (
          <div className="w-full max-w-[900px] mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="text-gray-300 mb-6">
                <Search className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-[#013954] mb-4">
                No positions found for "{searchQuery}"
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Try adjusting your search terms or explore our popular job
                categories above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="px-8 py-3 bg-[#718B68] text-white rounded-lg hover:bg-[#5d7355] transition-all duration-300 font-semibold"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
