import React, { useEffect, useState } from "react";
import axios from "axios";
import { PiCurrencyDollarSimpleBold } from "react-icons/pi";
import { MdOutlineDescription } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

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

    fetchJobs();
  }, []);

  const normalizeString = (str) => (str ? str.toLowerCase().trim() : "");

  const filteredJobs = jobs.filter((job) => {
    const matchesJobType = selectedJobType
      ? normalizeString(job.jobType) === normalizeString(selectedJobType)
      : true;
    const matchesLocation = selectedLocation
      ? normalizeString(job.location) === normalizeString(selectedLocation)
      : true;
    return matchesJobType && matchesLocation;
  });

  const clearFilters = () => {
    setSelectedJobType("");
    setSelectedLocation("");
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 lg:p-12 flex justify-center">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl">
        {/* Filters Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm lg:w-80">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-8">
            {/* Job Type Filter */}
            <div>
              <h3 className="font-medium mb-4">Job Type</h3>
              <div className="space-y-3">
                {["Full-time", "Part-time"].map((type) => (
                  <label key={type} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="jobType"
                      value={type}
                      checked={selectedJobType === type}
                      onChange={(e) => setSelectedJobType(e.target.value)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h3 className="font-medium mb-4">Location</h3>
              <div className="space-y-3">
                {["Kathmandu", "Nepal"].map((location) => (
                  <label key={location} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="location"
                      value={location}
                      checked={selectedLocation === location}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1 ">
          {filteredJobs.length > 0 ? (
            <div className="grid gap-5">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {job.jobType}
                      </span>
                      <h2 className="text-xl font-bold">{job.title}</h2>
                    </div>

                    {/* Company Info */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{job.companyName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CiLocationOn className="text-gray-500" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PiCurrencyDollarSimpleBold className="text-gray-500" />
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex gap-2">
                      <MdOutlineDescription className="flex-shrink-0 mt-1 text-gray-500" />
                      <p className="text-gray-600 line-clamp-2">
                        {job.introduction || "No description available"}
                      </p>
                    </div>

                    {/* Responsibilities */}
                    {job.responsibilities && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Responsibilities:</h4>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                          {job.responsibilities
                            .split(/,\s*/)
                            .map((resp, idx) => (
                              <li key={idx} className="text-gray-600">
                                {resp.trim()}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-sm text-gray-500">
                        Posted: {new Date(job.jobPostedOn).toLocaleDateString()}
                      </span>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                        View Details
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
