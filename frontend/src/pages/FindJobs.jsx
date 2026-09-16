import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react"; // Removed useContext
import { useSelector } from "react-redux"; // Import Redux useSelector hook
import ApplyForm from "./ApplyForm";
// Removed AuthContext import
// import { AuthContext } from "../context/AuthContext";

import axios from "axios";
import {
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Check,
  LogIn, // Assuming LogIn is for login/logout context, keeping for now if used elsewhere
  ArrowRight,
  Rss,
  Sparkles,
  Target,
  Loader2,
} from "lucide-react";
import { BASE_URL } from "../config/config";

// Removed isLoggedIn prop as it's now derived from Redux's isAuthenticated
const JobPortal = ({ notification, setNotification }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJobId, setApplyJobId] = useState(null);
  const [applyJobTitle, setApplyJobTitle] = useState("");
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null); // Not used currently, but kept
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");

  const [selectedSalaryRange, setSelectedSalaryRange] = useState("");

  const clearFilters = () => {
    setSelectedJobType("");
    setSelectedLocation("");
    setSelectedExperienceLevel("");
    setSelectedSalaryRange("");
    setSearchQuery("");
  };

  // Use useSelector to get user and isAuthenticated state from the Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [filterExpanded, setFilterExpanded] = useState({
    jobType: true,
    location: true,
    experience: true,
    salary: true,
  });

  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [errorRecommended, setErrorRecommended] = useState(null);

  const [recommended2Jobs, setRecommended2Jobs] = useState([]);
  const [loadingRecommended2, setLoadingRecommended2] = useState(true);
  const [errorRecommended2, setErrorRecommended2] = useState(null);

  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // AI resume-to-job matching (skills + embeddings + TF-IDF confidence score)
  const [resumeSkills, setResumeSkills] = useState([]);
  const [resumeMatches, setResumeMatches] = useState([]);
  const [recommendedJob, setRecommendedJob] = useState(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);
  const [resumeAnalysisError, setResumeAnalysisError] = useState(null);
  const [hasAnalyzedResume, setHasAnalyzedResume] = useState(false);

  const matchScoreMap = useMemo(() => {
    const map = new Map();
    resumeMatches.forEach((match) => map.set(match.jobId, match));
    return map;
  }, [resumeMatches]);

  const analyzeResumeMatch = async () => {
    if (!user?.resume?.url) {
      setResumeAnalysisError(
        "Please upload a resume in your profile before matching."
      );
      return;
    }
    setAnalyzingResume(true);
    setResumeAnalysisError(null);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/job/analyze-resume`,
        { cvUrl: user.resume.url },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setResumeSkills(res.data.skills || []);
      setResumeMatches(res.data.matches || []);
      setRecommendedJob(res.data.recommendedJob || null);
      setHasAnalyzedResume(true);
    } catch (err) {
      setResumeAnalysisError(
        err.response?.data?.message ||
          "Couldn't analyze your resume right now. Please try again."
      );
    } finally {
      setAnalyzingResume(false);
    }
  };

  const JOBS_PER_PAGE = 3;
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [jobsPage, setJobsPage] = useState(1);

  // Fetch all jobs (main list)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/v1/job/getall`, {
          // Include authorization header only if user is authenticated and token exists
          headers:
            isAuthenticated && user?.token
              ? { Authorization: `Bearer ${user.token}` }
              : {},
        });
        setJobs(response.data.jobs || []);
      } catch (err) {
        setError(err.message || "Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [isAuthenticated, user]); // Re-fetch if user's auth status changes

  // Fetch recommended first API
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      // Only fetch if authenticated and user object with token exists
      if (isAuthenticated && user && user.token) {
        try {
          setLoadingRecommended(true);
          const res = await axios.get(`${BASE_URL}/api/v1/recommend-jobs`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          console.log("First recommended jobs response:", res.data.jobs);
          setRecommendedJobs(res.data.jobs || []);
          setErrorRecommended(null);
        } catch (err) {
          console.error("Error fetching recommended jobs (first API):", err);
          setErrorRecommended("Could not fetch recommended jobs.");
          setRecommendedJobs([]);
        } finally {
          setLoadingRecommended(false);
        }
      } else {
        // Clear recommended jobs if not authenticated
        setRecommendedJobs([]);
        setLoadingRecommended(false);
      }
    };
    fetchRecommendedJobs();
  }, [isAuthenticated, user]); // Re-fetch if user's auth status changes

  // Fetch recommended second API
  useEffect(() => {
    const fetchRecommended2Jobs = async () => {
      // Only fetch if authenticated and user object with token exists
      if (isAuthenticated && user && user.token) {
        try {
          setLoadingRecommended2(true);
          const res = await axios.get(`${BASE_URL}/api/v1/recommended`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });

          console.log("Second recommended jobs response:", res.data);

          // Use recommendedJobs key from API response
          const normalizedJobs = (res.data.recommendedJobs || []).map((job) => {
            if (!job._id && job.id) job._id = job.id; // Normalize id to _id if needed
            return job;
          });

          console.log("Normalized recommended2Jobs:", normalizedJobs);
          setRecommended2Jobs(normalizedJobs);
          setErrorRecommended2(null);
        } catch (err) {
          console.error("Error fetching recommended jobs (second API):", err);
          setErrorRecommended2(
            "Could not fetch recommended jobs from second API."
          );
          setRecommended2Jobs([]);
        } finally {
          setLoadingRecommended2(false);
        }
      } else {
        // Clear recommended jobs if not authenticated
        setRecommended2Jobs([]);
        setLoadingRecommended2(false);
      }
    };
    fetchRecommended2Jobs();
  }, [isAuthenticated, user]); // Re-fetch if user's auth status changes

  // Fetch applied jobs
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      // Only fetch if authenticated and user object with token exists
      if (isAuthenticated && user && user.token) {
        try {
          const res = await axios.get(
            `${BASE_URL}/api/v1/application/my-applications`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
            }
          );
          // Ensure res.data.applications is an array before mapping
          if (Array.isArray(res.data.applications)) {
            setAppliedJobIds(res.data.applications.map((app) => app.jobId));
          } else {
            setAppliedJobIds([]);
          }
        } catch (err) {
          console.error("Error fetching applied jobs:", err);
          setAppliedJobIds([]);
        }
      } else {
        // Clear applied jobs if not authenticated
        setAppliedJobIds([]);
      }
    };
    fetchAppliedJobs();
  }, [isAuthenticated, user]); // Re-fetch if user's auth status changes

  // Utility functions
  const normalizeString = (str) => (str ? str.toLowerCase().trim() : "");

  // Combine recommended jobs with deduplication
  const combinedRecommendedJobs = useMemo(() => {
    const uniqueJobs = [];
    const seenIds = new Set();
    [...recommendedJobs, ...recommended2Jobs].forEach((job) => {
      if (job?._id && !seenIds.has(job._id)) {
        // Use optional chaining for job._id
        seenIds.add(job._id);
        uniqueJobs.push(job);
      }
    });
    console.log("Combined Unique Recommended Jobs:", uniqueJobs);
    return uniqueJobs;
  }, [recommendedJobs, recommended2Jobs]);

  // Set of recommended job IDs for filtering
  const recommendedJobIds = useMemo(() => {
    const ids = new Set(
      combinedRecommendedJobs.map((job) => job?._id).filter(Boolean) // Use optional chaining for job._id
    );
    console.log("Recommended Job IDs Set:", Array.from(ids));
    return ids;
  }, [combinedRecommendedJobs]);

  // Filter main jobs to exclude recommended and apply user filters
  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      // Use optional chaining for job._id
      if (!job?._id || recommendedJobIds.has(job._id)) {
        return false; // exclude recommended jobs or jobs without _id
      }

      // Only jobs posted last 25 days
      const postedDate = new Date(job.jobPostedOn);
      const now = new Date();
      const diffDays = (now - postedDate) / (1000 * 60 * 60 * 24);
      if (diffDays > 25) return false;

      if (
        selectedJobType &&
        normalizeString(job.jobType) !== normalizeString(selectedJobType)
      )
        return false;
      if (
        selectedLocation &&
        normalizeString(job.location) !== normalizeString(selectedLocation)
      )
        return false;
      if (
        searchQuery &&
        !(
          normalizeString(job.title).includes(normalizeString(searchQuery)) ||
          normalizeString(job.companyName).includes(
            normalizeString(searchQuery)
          )
        )
      )
        return false;

      return true;
    });
    return filtered;
  }, [
    jobs,
    recommendedJobIds,
    searchQuery,
    selectedJobType,
    selectedLocation,
  ]);

  // Once the resume has been analyzed, surface the best skill/description
  // matches first (jobs without a computed score keep their original order,
  // pushed after every scored job).
  const sortedFilteredJobs = useMemo(() => {
    if (!hasAnalyzedResume || matchScoreMap.size === 0) return filteredJobs;
    return [...filteredJobs].sort((a, b) => {
      const scoreA = matchScoreMap.get(a._id)?.score ?? -1;
      const scoreB = matchScoreMap.get(b._id)?.score ?? -1;
      return scoreB - scoreA;
    });
  }, [filteredJobs, matchScoreMap, hasAnalyzedResume]);

  // Pagination slices
  const totalCombinedRecommendedPages = Math.ceil(
    combinedRecommendedJobs.length / JOBS_PER_PAGE
  );
  const paginatedCombinedRecommendedJobs = combinedRecommendedJobs.slice(
    (recommendedPage - 1) * JOBS_PER_PAGE,
    recommendedPage * JOBS_PER_PAGE
  );

  const totalJobsPages = Math.ceil(sortedFilteredJobs.length / JOBS_PER_PAGE);
  const paginatedFilteredJobs = sortedFilteredJobs.slice(
    (jobsPage - 1) * JOBS_PER_PAGE,
    jobsPage * JOBS_PER_PAGE
  );

  // Apply handler
  const handleApply = (jobId, jobTitle) => {
    // Get token from the Redux user object, fallback to localStorage if needed
    const token = user?.token || localStorage.getItem("authToken");

    if (token) {
      if (appliedJobIds.includes(jobId)) {
        if (setNotification) {
          setNotification({
            type: "error",
            message: "You already applied to this job.",
          });
        } else {
          window.alert("You already applied to this job.");
        }
        return;
      }
      setApplyJobId(jobId);
      setApplyJobTitle(jobTitle);
      setShowApplyModal(true);
    } else {
      if (setNotification) {
        setNotification({
          type: "error",
          message: "Please log in to apply for jobs.",
        });
      } else {
        window.alert("Please log in to apply for jobs.");
      }
    }
  };

  // Job Card Component (no changes needed for Redux migration, but ensure job._id is accessed safely)
  const JobCard = ({ job }) => {
    const isApplied = appliedJobIds.includes(job?._id); // Use optional chaining for job._id
    const match = matchScoreMap.get(job?._id);
    const isTopRecommended = recommendedJob?.jobId === job?._id;
    const matchColor =
      match?.score >= 70
        ? "text-green-700 bg-green-100 border-green-300"
        : match?.score >= 40
        ? "text-amber-700 bg-amber-100 border-amber-300"
        : "text-gray-600 bg-gray-100 border-gray-300";
    return (
      <div
        onClick={() =>
          navigate(`/post/application/${job._id}`, { state: { match } })
        }
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/post/application/${job._id}`, { state: { match } });
          }
        }}
        className={`group p-4 border rounded-xl hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50 cursor-pointer ${
          isTopRecommended
            ? "border-[#718B68] ring-2 ring-[#718B68] ring-opacity-40"
            : "border-gray-200 hover:border-[#718B68]"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 w-full">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <div className="p-2 bg-gray-100 group-hover:bg-[#718B68] group-hover:bg-opacity-10 rounded-lg transition-all">
                <Briefcase className="w-5 h-5 text-gray-600 group-hover:text-[#718B68]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-[#013954] group-hover:text-[#718B68] transition-colors">
                    {job.title}
                  </h3>
                  {match && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${matchColor}`}
                      title={`Semantic: ${match.semanticScore}% · Keyword: ${match.tfidfScore}%`}
                    >
                      <Target className="w-3 h-3" />
                      {match.score}% Match
                    </span>
                  )}
                  {isTopRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#013954] text-white">
                      <Sparkles className="w-3 h-3" />
                      Best Match
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-2">
                  <span className="flex items-center gap-2 font-medium">
                    <div className="w-2 h-2 bg-[#718B68] rounded-full"></div>
                    {job.personalWebsites && job.personalWebsites.url
                      ? (() => {
                          let url = job.personalWebsites.url;
                          if (url && !/^https?:\/\//i.test(url)) {
                            url = "https://" + url;
                          }
                          return (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#013954] hover:underline hover:text-[#718B68] transition-colors"
                            >
                              {job.companyName}
                            </a>
                          );
                        })()
                      : job.companyName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {job.jobPostedOn
                      ? new Date(job.jobPostedOn).toLocaleDateString()
                      : "N/A"}
                  </span>
                  {/* Job Niche Badge */}
                  {job.jobNiche && (
                    <span className="px-2 py-1 bg-[#718B68] bg-opacity-10 text-[#718B68] rounded-full font-semibold text-xs border border-[#718B68]">
                      {job.jobNiche}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2 leading-relaxed text-sm break-words">
                  {job.introduction || "No description available"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                {job.jobType}
              </span>
            </div>
            {(job.responsibilities || job.qualifications) && (
              <div
                className="flex flex-col sm:flex-row flex-wrap gap-3 mt-2"
              >
                {job.responsibilities && (
                  <div
                    className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-xl p-3 max-h-36 overflow-y-auto"
                  >
                    <h4 className="font-semibold text-[#013954] mb-1 flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-[#718B68] rounded-full"></span>
                      Responsibilities
                    </h4>
                    <ul className="list-disc pl-4 text-gray-700 text-xs space-y-1 break-words">
                      {job.responsibilities.split(/,\s*/).map((item, idx) => (
                        <li key={idx}>{item.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {job.qualifications && (
                  <div
                    className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-xl p-3 max-h-36 overflow-y-auto"
                  >
                    <h4 className="font-semibold text-[#013954] mb-1 flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 bg-[#718B68] rounded-full"></span>
                      Qualifications
                    </h4>
                    <ul className="list-disc pl-4 text-gray-700 text-xs space-y-1 break-words">
                      {job.qualifications.split(/,\s*/).map((item, idx) => (
                        <li key={idx}>{item.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between gap-3 lg:min-w-[130px]">
            <div className="text-left lg:text-right">
              <div className="flex items-center gap-1 text-lg font-bold text-[#718B68] mb-1">
                <p className="w-5 h-5" />
                Rs {job.salary}
              </div>
              <p className="text-xs text-gray-500">per month</p>
            </div>
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-xs transition-all duration-300 ${
                  isApplied
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#013954] text-white hover:bg-[#025373]"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isApplied) {
                    handleApply(job._id, job.title);
                  } else if (setNotification) {
                    setNotification({
                      type: "error",
                      message: "You already applied to this job.",
                    });
                  } else {
                    window.alert("You already applied to this job.");
                  }
                }}
                disabled={isApplied}
              >
                {isApplied ? "Already Applied" : "Apply Now"}
                {!isApplied && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#718B68] border-opacity-50 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-[#013954]">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-lg mb-2">Error loading jobs</div>
          <p className="text-gray-600">{error}</p>
          <button
            className="mt-4 bg-[#718B68] text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 left-0 z-50 py-4">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center ${
            notification.type === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <div className="mr-3">
            {notification.type === "success" ? (
              <Check className="text-green-500" size={20} />
            ) : (
              <LogIn className="text-red-500" size={20} />
            )}
          </div>
          <div className="flex-grow">
            <p
              className={`${
                notification.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              } font-medium`}
            >
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-[#013954] text-white p-6 mt-24">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-10 md:px-16 lg:px-32">
          <h1 className="text-3xl font-bold">Find Your Dream Job</h1>
          <p className="mt-2">
            Browse through our extensive list of opportunities
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-[#718B68] text-white p-4">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-10 md:px-16 lg:px-32">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs, companies, or locations..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#013954]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main content with sidebar and jobs */}
      <div className="w-full max-w-screen-xl mx-auto py-8 px-4 sm:px-10 md:px-16 lg:px-32">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <div className="w-full md:w-[310px] shrink-0">
            <div className="w-full md:w-[310px] h-auto bg-white rounded-[17px] shadow-[0px_4px_26px_#0000001a] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#013954]">Filters</h3>
                <button
                  className="text-[#718B68] text-sm hover:underline"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <div
                  className="flex items-center justify-between cursor-pointer mb-2"
                  onClick={() =>
                    setFilterExpanded((f) => ({ ...f, jobType: !f.jobType }))
                  }
                >
                  <h4 className="font-semibold text-[#013954]">Job Type</h4>
                  {filterExpanded.jobType ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                {filterExpanded.jobType && (
                  <div className="space-y-2 pl-1">
                    {["Full-time", "Part-time"].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="jobType"
                          value={type}
                          checked={selectedJobType === type}
                          onChange={(e) => setSelectedJobType(e.target.value)}
                          className="mr-2 accent-[#718B68]"
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <div
                  className="flex items-center justify-between cursor-pointer mb-2"
                  onClick={() =>
                    setFilterExpanded((f) => ({ ...f, location: !f.location }))
                  }
                >
                  <h4 className="font-semibold text-[#013954]">Location</h4>
                  {filterExpanded.location ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                {filterExpanded.location && (
                  <div className="space-y-2 pl-1">
                    {[
                      "Kathmandu",
                      "Nepal",
                      "Pokhara",
                      "Nepalgunj",
                      "Manang",
                      "Mustang",
                      "Dang",
                      "Jorpati",
                      "Lalitpur",
                      "Bhaktapur",
                      "Makwanpur",
                      "Banasthali",
                      "Swoyambhu",
                      "Chabhil",
                      "Baneswor",
                    ].map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          value={location}
                          checked={selectedLocation === location}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="mr-2 accent-[#718B68]"
                        />
                        <span className="text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Apply Filters Button */}
              {/* This button might need to trigger handleSearch directly if filters don't auto-apply */}
              <button className="w-full bg-[#718B68] text-white font-medium py-3 rounded-md hover:bg-opacity-90 mt-2">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-grow">
            {/* AI Resume Matcher */}
            {isAuthenticated && user?.role === "Job Seeker" && (
              <div className="mb-10 bg-white rounded-[17px] shadow-[0px_4px_26px_#0000001a] p-6 border border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#718B68] bg-opacity-10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-[#718B68]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#013954]">
                        AI Resume Match
                      </h2>
                      <p className="text-sm text-gray-500">
                        Compare your resume against every job posting and see
                        a match score for each.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={analyzeResumeMatch}
                    disabled={analyzingResume}
                    className="flex items-center gap-2 bg-[#013954] text-white font-medium px-5 py-2.5 rounded-lg hover:bg-[#025373] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {analyzingResume ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4" />
                        {hasAnalyzedResume
                          ? "Re-analyze Resume"
                          : "Match My Resume"}
                      </>
                    )}
                  </button>
                </div>

                {analyzingResume && (
                  <p className="text-xs text-gray-400 mt-3">
                    First run can take a little longer while the matching
                    model warms up.
                  </p>
                )}

                {resumeAnalysisError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                    {resumeAnalysisError}
                  </div>
                )}

                {hasAnalyzedResume && !resumeAnalysisError && (
                  <div className="mt-5 space-y-4">
                    {resumeSkills.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Skills detected in your resume
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {resumeSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-[#718B68] bg-opacity-10 text-[#718B68] rounded-full text-xs font-medium border border-[#718B68] border-opacity-30 capitalize"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {recommendedJob ? (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#013954] bg-opacity-5 border border-[#013954] border-opacity-20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-[#013954]" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Your best match right now
                            </p>
                            <p className="font-bold text-[#013954]">
                              {recommendedJob.title} at{" "}
                              {recommendedJob.companyName}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 bg-[#013954] text-white rounded-full text-sm font-bold">
                          {recommendedJob.score}% Match
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No active jobs matched your resume yet. Check back
                        once more jobs are posted.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Loading state for recommended jobs */}
            {isAuthenticated &&
              (loadingRecommended || loadingRecommended2) && ( // Only show if authenticated
                <div className="mb-10 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#718B68] border-opacity-50 mx-auto mb-4"></div>
                  <p className="text-lg font-medium text-[#013954]">
                    Loading recommended jobs...
                  </p>
                </div>
              )}

            {/* Error state for recommended jobs */}
            {isAuthenticated && // Only show if authenticated
              !loadingRecommended &&
              !loadingRecommended2 &&
              (errorRecommended || errorRecommended2) && (
                <div className="mb-10 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                  {errorRecommended && <p>{errorRecommended}</p>}
                  {errorRecommended2 && <p>{errorRecommended2}</p>}
                  {combinedRecommendedJobs.length > 0 ? (
                    <p>Showing available recommended jobs.</p>
                  ) : (
                    <p></p>
                  )}
                </div>
              )}

            {/* Combined Recommended Jobs */}
            {isAuthenticated && // Only show if authenticated
              !loadingRecommended &&
              !loadingRecommended2 &&
              combinedRecommendedJobs.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-[#013954] mb-4">
                    Jobs According to Your Interest
                  </h2>
                  <div className="space-y-4">
                    {paginatedCombinedRecommendedJobs.map((job) => (
                      <JobCard key={job?._id || job.id} job={job} /> // Added fallback to job.id
                    ))}
                  </div>

                  {totalCombinedRecommendedPages > 1 && (
                    <div className="mt-4 flex justify-center space-x-2">
                      <button
                        className="px-3 py-2 border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        onClick={() =>
                          setRecommendedPage((p) => Math.max(1, p - 1))
                        }
                        disabled={recommendedPage === 1}
                      >
                        Previous
                      </button>
                      <span className="px-3 py-2 text-gray-700 font-medium">
                        {recommendedPage} / {totalCombinedRecommendedPages}
                      </span>
                      <button
                        className="px-3 py-2 border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        onClick={() =>
                          setRecommendedPage((p) =>
                            Math.min(totalCombinedRecommendedPages, p + 1)
                          )
                        }
                        disabled={
                          recommendedPage === totalCombinedRecommendedPages
                        }
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}

            <h2 className="text-2xl font-semibold text-[#013954] mb-6">
              {filteredJobs.length} Jobs Available
            </h2>

            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {paginatedFilteredJobs.map((job) => (
                  <JobCard key={job?._id || job.id} job={job} /> // Added fallback to job.id
                ))}

                {totalJobsPages > 1 && (
                  <div className="mt-6 flex justify-center space-x-2">
                    <button
                      className="px-3 py-2 border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      onClick={() => setJobsPage((p) => Math.max(1, p - 1))}
                      disabled={jobsPage === 1}
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-gray-700 font-medium">
                      {jobsPage} / {totalJobsPages}
                    </span>
                    <button
                      className="px-3 py-2 border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      onClick={() =>
                        setJobsPage((p) => Math.min(totalJobsPages, p + 1))
                      }
                      disabled={jobsPage === totalJobsPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 md:p-12 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="mb-4 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-red-400 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-600 mb-2">
                  Oops! No Jobs Found
                </h3>
                <p className="text-red-500 mb-4">
                  We couldn't find any matches for your current filters
                </p>
                <div className="text-sm text-red-400">
                  Try:
                  <ul className="mt-2 space-y-1">
                    <li>• Adjusting your location preferences</li>
                    <li>• Expanding job type selections</li>
                    <li>• Clearing all filters</li>
                  </ul>
                </div>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-[#718B68] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
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
              setNotification={setNotification}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPortal;
