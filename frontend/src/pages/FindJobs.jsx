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
  const JOBS_PER_PAGE = 4;
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
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-10 md:px-16 lg:px-32 flex justify-end">
          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="mr-2">Logged in</span>
              <div className="h-3 w-3 bg-green-400 rounded-full"></div>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="mr-2">Not logged in</span>
              <div className="h-3 w-3 bg-red-400 rounded-full"></div>
            </div>
          )}
        </div>
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
                    {["Full-time", "Part-time", "Contract", "Internship"].map(
                      (type) => (
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
                      )
                    )}
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
                    {["Kathmandu", "Nepal", "Remote", "Onsite"].map(
                      (location) => (
                        <label key={location} className="flex items-center">
                          <input
                            type="radio"
                            name="location"
                            value={location}
                            checked={selectedLocation === location}
                            onChange={(e) =>
                              setSelectedLocation(e.target.value)
                            }
                            className="mr-2 accent-[#718B68]"
                          />
                          <span className="text-gray-700">{location}</span>
                        </label>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <div
                  className="flex items-center justify-between cursor-pointer mb-2"
                  onClick={() => toggleSection("experience")}
                >
                  <h4 className="font-semibold text-[#013954]">
                    Experience Level
                  </h4>
                  {filterExpanded.experience ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                {filterExpanded.experience && (
                  <div className="space-y-2 pl-1">
                    {[
                      "Entry Level",
                      "Mid Level",
                      "Senior Level",
                      "Manager",
                    ].map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="experienceLevel"
                          value={level}
                          checked={selectedExperienceLevel === level}
                          onChange={(e) =>
                            setSelectedExperienceLevel(e.target.value)
                          }
                          className="mr-2 accent-[#718B68]"
                        />
                        <span className="text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <div
                  className="flex items-center justify-between cursor-pointer mb-2"
                  onClick={() => toggleSection("salary")}
                >
                  <h4 className="font-semibold text-[#013954]">Salary Range</h4>
                  {filterExpanded.salary ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>

                {filterExpanded.salary && (
                  <div className="space-y-2 pl-1">
                    {["$0-$50k", "$50k-$100k", "$100k-$150k", "$150k+"].map(
                      (range) => (
                        <label key={range} className="flex items-center">
                          <input
                            type="radio"
                            name="salaryRange"
                            value={range}
                            checked={selectedSalaryRange === range}
                            onChange={(e) =>
                              setSelectedSalaryRange(e.target.value)
                            }
                            className="mr-2 accent-[#718B68]"
                          />
                          <span className="text-gray-700">{range}</span>
                        </label>
                      )
                    )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedRecommendedJobs.map((job) => (
                    <div
                      key={job._id}
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white h-full flex flex-col"
                    >
                      {/* Job Card Header (same as other jobs) */}
                      <div
                        className="p-4 cursor-pointer flex-grow"
                        onClick={() => toggleJobExpand(job._id)}
                      >
                        <div className="flex flex-row gap-4 justify-between items-start flex-wrap">
                          {/* Left: Job Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-[#718B68] bg-opacity-20 text-[#718B68] rounded-full text-xs font-medium">
                                {job.jobType}
                              </span>
                              <h3 className="text-lg font-bold text-[#013954] line-clamp-1 break-all">
                                {job.title}
                              </h3>
                            </div>
                            <div className="flex items-center mt-1 text-gray-600 text-sm">
                              <Briefcase
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span className="font-medium truncate">
                                {job.companyName}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 text-gray-600 text-sm">
                              <MapPin
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span className="truncate">{job.location}</span>
                            </div>
                          </div>
                          {/* Right: Date & Salary, always right-aligned and stacked */}
                          <div className="flex flex-col items-end min-w-[110px] mt-2 md:mt-0">
                            <div className="flex items-center text-gray-600 text-xs mb-1">
                              <Calendar
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span>
                                {new Date(job.jobPostedOn).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-800 font-medium text-sm">
                              <DollarSign
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-gray-600 text-sm">
                          <p className="line-clamp-2">
                            {job.introduction || "No description available"}
                          </p>
                        </div>
                        <div className="mt-3 flex justify-center">
                          <button
                            className="flex items-center text-[#013954] hover:text-opacity-80 text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleJobExpand(job._id);
                            }}
                          >
                            {expandedJob === job._id ? (
                              <>
                                View Less{" "}
                                <ChevronUp size={14} className="ml-1" />
                              </>
                            ) : (
                              <>
                                View More{" "}
                                <ChevronDown size={14} className="ml-1" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      {expandedJob === job._id && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                          {job.responsibilities && (
                            <div className="mb-3">
                              <h4 className="font-bold text-base text-[#013954] mb-1">
                                Responsibilities
                              </h4>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                {job.responsibilities
                                  .split(/,\s*/)
                                  .map((item, index) => (
                                    <li key={index} className="text-gray-700">
                                      {item.trim()}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                          {job.qualifications && (
                            <div className="mb-3">
                              <h4 className="font-bold text-base text-[#013954] mb-1">
                                Qualifications
                              </h4>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                {job.qualifications
                                  .split(/,\s*/)
                                  .map((item, index) => (
                                    <li key={index} className="text-gray-700">
                                      {item.trim()}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                          {job.offers && (
                            <div className="mb-3">
                              <h4 className="font-bold text-base text-[#013954] mb-1">
                                What We Offer
                              </h4>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                {job.offers.split(/,\s*/).map((item, index) => (
                                  <li key={index} className="text-gray-700">
                                    {item.trim()}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="mt-4 flex justify-end">
                            <button
                              className="bg-[#718B68] text-white px-4 py-2 rounded-md hover:bg-opacity-90 font-medium text-sm"
                              onClick={() => handleApply(job._id, job.title)}
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      )}
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
              <div>
                {/* Grid layout for job cards - two columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedFilteredJobs.map((job) => (
                    <div
                      key={job._id}
                      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white h-full flex flex-col"
                    >
                      {/* Job Card Header */}
                      <div
                        className="p-4 cursor-pointer flex-grow"
                        onClick={() => toggleJobExpand(job._id)}
                      >
                        <div className="flex flex-row gap-4 justify-between items-start flex-wrap">
                          {/* Left: Job Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-[#718B68] bg-opacity-20 text-[#718B68] rounded-full text-xs font-medium">
                                {job.jobType}
                              </span>
                              <h3 className="text-lg font-bold text-[#013954] line-clamp-1 break-all">
                                {job.title}
                              </h3>
                            </div>
                            <div className="flex items-center mt-1 text-gray-600 text-sm">
                              <Briefcase
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span className="font-medium truncate">
                                {job.companyName}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 text-gray-600 text-sm">
                              <MapPin
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span className="truncate">{job.location}</span>
                            </div>
                          </div>
                          {/* Right: Date & Salary, always right-aligned and stacked */}
                          <div className="flex flex-col items-end min-w-[110px] mt-2 md:mt-0">
                            <div className="flex items-center text-gray-600 text-xs mb-1">
                              <Calendar
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span>
                                {new Date(job.jobPostedOn).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-800 font-medium text-sm">
                              <DollarSign
                                size={14}
                                className="mr-1 flex-shrink-0"
                              />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>

                        {/* Short description (always visible) */}
                        <div className="mt-3 text-gray-600 text-sm">
                          <p className="line-clamp-2">
                            {job.introduction || "No description available"}
                          </p>
                        </div>

                        {/* Expand/Collapse button */}
                        <div className="mt-3 flex justify-center">
                          <button
                            className="flex items-center text-[#013954] hover:text-opacity-80 text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleJobExpand(job._id);
                            }}
                          >
                            {expandedJob === job._id ? (
                              <>
                                View Less{" "}
                                <ChevronUp size={14} className="ml-1" />
                              </>
                            ) : (
                              <>
                                View More{" "}
                                <ChevronDown size={14} className="ml-1" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {expandedJob === job._id && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                          {/* Responsibilities */}
                          {job.responsibilities && (
                            <div className="mb-3">
                              <h4 className="font-bold text-base text-[#013954] mb-1">
                                Responsibilities
                              </h4>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                {job.responsibilities
                                  .split(/,\s*/)
                                  .map((item, index) => (
                                    <li key={index} className="text-gray-700">
                                      {item.trim()}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {/* Qualifications */}
                          {job.qualifications && (
                            <div className="mb-3">
                              <h4 className="font-bold text-base text-[#013954] mb-1">
                                Qualifications
                              </h4>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                {job.qualifications
                                  .split(/,\s*/)
                                  .map((item, index) => (
                                    <li key={index} className="text-gray-700">
                                      {item.trim()}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {/* Offers */}
                          {job.offers && (
                            <div className="mb-3">
                              <h4 className="font-bold text-base text-[#013954] mb-1">
                                What We Offer
                              </h4>
                              <ul className="list-disc pl-5 space-y-1 text-sm">
                                {job.offers.split(/,\s*/).map((item, index) => (
                                  <li key={index} className="text-gray-700">
                                    {item.trim()}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Apply button */}
                          <div className="mt-4 flex justify-end">
                            <button
                              className="bg-[#718B68] text-white px-4 py-2 rounded-md hover:bg-opacity-90 font-medium text-sm"
                              onClick={() => handleApply(job._id, job.title)}
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Pagination for filtered jobs */}
                {totalJobsPages > 1 && (
                  <div className="mt-8 flex justify-center space-x-2">
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
