import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
} from "lucide-react";
import { BASE_URL } from "../config/config";

// Theme colors
// 718B68 - Sage Green
// FFFFFF - White
// 013954 - Navy Blue

const JobPortal = () => {
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/job/getall`);
        setJobs(response.data.jobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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

  // Filter jobs based on all criteria and only show jobs posted within the last 20 days
  const filteredJobs = jobs.filter((job) => {
    const postedDate = new Date(job.jobPostedOn);
    const now = new Date();
    const diffDays = (now - postedDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 20) return false;
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

  // Only show 3 jobs on this page
  const jobsPerPage = 3;
  const paginatedJobs = filteredJobs.slice(0, jobsPerPage);

  // For navigation
  const navigate = useNavigate();

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
            <h2 className="text-2xl font-semibold text-[#013954] mb-6">
              {filteredJobs.length} Jobs Available
            </h2>
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {paginatedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="group p-6 border border-gray-200 rounded-xl hover:border-[#718B68] hover:shadow-lg transition-all duration-300 bg-white hover:bg-gray-50"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
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
                                <Calendar className="w-4 h-4" />
                                {new Date(job.jobPostedOn).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {job.introduction || "No description available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            {job.jobType}
                          </span>
                        </div>
                        {/* Responsibilities & Qualifications (Hero style) */}
                        {(job.responsibilities || job.qualifications) && (
                          <div className="flex flex-wrap gap-4 mt-4">
                            {job.responsibilities && (
                              <div className="flex-1 min-w-[180px] bg-gray-50 border border-gray-100 rounded-xl p-4">
                                <h4 className="font-semibold text-[#013954] mb-2 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-[#718B68] rounded-full"></span>
                                  Responsibilities
                                </h4>
                                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                                  {job.responsibilities
                                    .split(/,\s*/)
                                    .map((item, idx) => (
                                      <li key={idx}>{item.trim()}</li>
                                    ))}
                                </ul>
                              </div>
                            )}
                            {job.qualifications && (
                              <div className="flex-1 min-w-[180px] bg-gray-50 border border-gray-100 rounded-xl p-4">
                                <h4 className="font-semibold text-[#013954] mb-2 flex items-center gap-2">
                                  <span className="w-2 h-2 bg-[#718B68] rounded-full"></span>
                                  Qualifications
                                </h4>
                                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
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
                      <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xl font-bold text-[#718B68] mb-1">
                            <DollarSign className="w-5 h-5" />
                            {job.salary}
                          </div>
                          <p className="text-sm text-gray-500">per year</p>
                        </div>
                        <div className="flex gap-3">
                          <button className="px-6 py-3 bg-[#013954] text-white rounded-lg hover:bg-[#025373] transition-all duration-300 font-medium flex items-center gap-2">
                            Apply Now
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

            {/* Show Next button if there are more than 3 jobs */}
            {filteredJobs.length > jobsPerPage && (
              <div className="mt-8 flex justify-center">
                <button
                  className="px-5 py-3 border rounded-md bg-[#718B68] text-white font-semibold hover:bg-opacity-90 transition"
                  onClick={() => navigate("/findjobs")}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPortal;
