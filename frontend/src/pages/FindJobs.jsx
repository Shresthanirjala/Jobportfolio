import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import ApplyForm from "./ApplyForm";
import { AuthContext } from "../context/AuthContext";

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
  LogIn,
  ArrowRight,
} from "lucide-react";

// Theme colors
// 718B68 - Sage Green
// FFFFFF - White
// 013954 - Navy Blue

const JobPortal = ({ isLoggedIn, notification, setNotification }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJobId, setApplyJobId] = useState(null);
  const [applyJobTitle, setApplyJobTitle] = useState("");
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("");
  const [selectedSalaryRange, setSelectedSalaryRange] = useState("");

  // Filter sections expanded state
  const [filterExpanded, setFilterExpanded] = useState({
    jobType: true,
    location: true,
    experience: true,
    salary: true,
  });

  const { user } = useContext(AuthContext);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [errorRecommended, setErrorRecommended] = useState(null);

  // Pagination states
  const JOBS_PER_PAGE = 3;
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [jobsPage, setJobsPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/job/getall"
        );
        setJobs(response.data.jobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch recommended jobs if user is logged in
    const fetchRecommendedJobs = async () => {
      if (user && user.token) {
        try {
          setLoadingRecommended(true);
          const res = await axios.get(
            "http://localhost:3000/api/v1/recommend-jobs",
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          setRecommendedJobs(res.data.jobs || []);
          setErrorRecommended(null);
        } catch (err) {
          setErrorRecommended("Could not fetch recommended jobs.");
        } finally {
          setLoadingRecommended(false);
        }
      } else {
        setRecommendedJobs([]);
        setLoadingRecommended(false);
      }
    };

    fetchJobs();
    fetchRecommendedJobs();
  }, [user]);

  const toggleJobExpand = (id) => {
    if (expandedJob === id) {
      setExpandedJob(null);
    } else {
      setExpandedJob(id);
    }
  };

  const toggleSection = (section) => {
    setFilterExpanded({
      ...filterExpanded,
      [section]: !filterExpanded[section],
    });
  };

  const clearFilters = () => {
    setSelectedJobType("");
    setSelectedLocation("");
    setSelectedExperienceLevel("");
    setSelectedSalaryRange("");
    setSearchQuery("");
  };

  const normalizeString = (str) => (str ? str.toLowerCase().trim() : "");

  const handleApply = (jobId, jobTitle) => {
    // Check localStorage for authToken to determine if user is logged in
    const token = localStorage.getItem("authToken");
    if (token) {
      setApplyJobId(jobId);
      setApplyJobTitle(jobTitle);
      setShowApplyModal(true); // Show the popup form
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

  // Get recommended job IDs to filter them out from other jobs
  const recommendedJobIds = new Set(recommendedJobs.map((job) => job._id));

  // Filter jobs based on all criteria and exclude recommended jobs
  const filteredJobs = jobs.filter((job) => {
    // Exclude jobs already shown in recommended
    if (recommendedJobIds.has(job._id)) return false;
    // Only show jobs posted within the last 25 days
    const postedDate = new Date(job.jobPostedOn);
    const now = new Date();
    const diffDays = (now - postedDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 25) return false;
    const matchesJobType = selectedJobType
      ? normalizeString(job.jobType) === normalizeString(selectedJobType)
      : true;
    const matchesLocation = selectedLocation
      ? normalizeString(job.location) === normalizeString(selectedLocation)
      : true;
    const matchesSearch = searchQuery
      ? normalizeString(job.title).includes(normalizeString(searchQuery)) ||
        normalizeString(job.companyName).includes(normalizeString(searchQuery))
      : true;
    return matchesJobType && matchesLocation && matchesSearch;
  });

  // Pagination logic for recommended jobs
  const totalRecommendedPages = Math.ceil(
    recommendedJobs.length / JOBS_PER_PAGE
  );
  const paginatedRecommendedJobs = recommendedJobs.slice(
    (recommendedPage - 1) * JOBS_PER_PAGE,
    recommendedPage * JOBS_PER_PAGE
  );

  // Pagination logic for filtered jobs
  const totalJobsPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedFilteredJobs = filteredJobs.slice(
    (jobsPage - 1) * JOBS_PER_PAGE,
    jobsPage * JOBS_PER_PAGE
  );

  // Loading state
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

  // Error state
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

      {/* User Login Status Indicator */}
      <div className="bg-[#718B68] text-white py-2">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-10 md:px-16 lg:px-32 flex justify-end"></div>
      </div>

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

      {/* Main content with sidebar filter */}
      <div className="w-full max-w-screen-xl mx-auto py-8 px-4 sm:px-10 md:px-16 lg:px-32">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
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
                  onClick={() => toggleSection("jobType")}
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
                  onClick={() => toggleSection("location")}
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
              <button className="w-full bg-[#718B68] text-white font-medium py-3 rounded-md hover:bg-opacity-90 mt-2">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-grow">
            {/* Recommended Jobs Section */}
            {user && recommendedJobs.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-[#013954] mb-4">
                  Jobs According to Your Interest
                </h2>
                <div className="space-y-4">
                  {paginatedRecommendedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="group p-4 border border-gray-200 rounded-xl hover:border-[#718B68] hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50"
                      style={{
                        minHeight: "260px",
                        maxHeight: "340px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "stretch",
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full h-full">
                        <div className="flex-1 flex flex-col justify-between h-full">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="p-2 bg-gray-100 group-hover:bg-[#718B68] group-hover:bg-opacity-10 rounded-lg transition-all">
                              <Briefcase className="w-5 h-5 text-gray-600 group-hover:text-[#718B68]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-[#013954] mb-1 group-hover:text-[#718B68] transition-colors">
                                {job.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-2">
                                <span className="flex items-center gap-2 font-medium">
                                  <div className="w-2 h-2 bg-[#718B68] rounded-full"></div>
                                  {job.companyName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(
                                    job.jobPostedOn
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-2 leading-relaxed text-sm">
                                {job.introduction || "No description available"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                              {job.jobType}
                            </span>
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
                        <div className="flex flex-col items-end gap-2 justify-between h-full">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-bold text-[#718B68] mb-1">
                              <DollarSign className="w-5 h-5" />
                              {job.salary}
                            </div>
                            <p className="text-xs text-gray-500">per year</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="px-4 py-2 bg-[#013954] text-white rounded-lg hover:bg-[#025373] transition-all duration-300 font-medium flex items-center gap-2 text-xs"
                              onClick={() => handleApply(job._id, job.title)}
                            >
                              Apply Now
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination for recommended jobs */}
                {totalRecommendedPages > 1 && (
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
                      {recommendedPage} / {totalRecommendedPages}
                    </span>
                    <button
                      className="px-3 py-2 border rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      onClick={() =>
                        setRecommendedPage((p) =>
                          Math.min(totalRecommendedPages, p + 1)
                        )
                      }
                      disabled={recommendedPage === totalRecommendedPages}
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
                  <div
                    key={job._id}
                    className="group p-4 border border-gray-200 rounded-xl hover:border-[#718B68] hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50"
                    style={{
                      minHeight: "260px",
                      maxHeight: "340px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full h-full">
                      <div className="flex-1 flex flex-col justify-between h-full">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 bg-gray-100 group-hover:bg-[#718B68] group-hover:bg-opacity-10 rounded-lg transition-all">
                            <Briefcase className="w-5 h-5 text-gray-600 group-hover:text-[#718B68]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-[#013954] mb-1 group-hover:text-[#718B68] transition-colors">
                              {job.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-2">
                              <span className="flex items-center gap-2 font-medium">
                                <div className="w-2 h-2 bg-[#718B68] rounded-full"></div>
                                {job.companyName}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(job.jobPostedOn).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2 leading-relaxed text-sm">
                              {job.introduction || "No description available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-1">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            {job.jobType}
                          </span>
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
                                style={{ maxHeight: "90px", overflowY: "auto" }}
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
                                style={{ maxHeight: "90px", overflowY: "auto" }}
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
                      <div className="flex flex-col items-end gap-2 justify-between h-full">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold text-[#718B68] mb-1">
                            <DollarSign className="w-5 h-5" />
                            {job.salary}
                          </div>
                          <p className="text-xs text-gray-500">per year</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 bg-[#013954] text-white rounded-lg hover:bg-[#025373] transition-all duration-300 font-medium flex items-center gap-2 text-xs"
                            onClick={() => handleApply(job._id, job.title)}
                          >
                            Apply Now
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Pagination for filtered jobs */}
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
