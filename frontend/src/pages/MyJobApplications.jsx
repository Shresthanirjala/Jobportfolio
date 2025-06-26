import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const MyJobApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDetails, setExpandedDetails] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:3000/api/v1/application/jobseeker/getall",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setJobApplications(response.data.application || []);
      } catch (err) {
        setJobApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const toggleDetails = (id) => {
    setExpandedDetails({
      ...expandedDetails,
      [id]: !expandedDetails[id],
    });
  };

  // Filter job applications based on status and search term
  const filteredJobs = jobApplications.filter((job) => {
    const status = (job.status || "pending").toLowerCase();
    const matchesStatus =
      jobFilter === "all" ||
      (jobFilter === "pending" && status === "pending") ||
      (jobFilter === "approved" && status === "approved") ||
      (jobFilter === "rejected" && status === "rejected");
    const seeker = job.jobSeekerInfo || {};
    const jobInfo = job.jobInfo || {};
    const matchesSearch =
      searchTerm === "" ||
      (jobInfo.jobTitle || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (seeker.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch ((status || "pending").toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        My Job Applications
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Job Applications
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setJobFilter("all")}
              className={`px-3 py-1 rounded-full text-sm ${
                jobFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setJobFilter("pending")}
              className={`px-3 py-1 rounded-full text-sm ${
                jobFilter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setJobFilter("approved")}
              className={`px-3 py-1 rounded-full text-sm ${
                jobFilter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setJobFilter("rejected")}
              className={`px-3 py-1 rounded-full text-sm ${
                jobFilter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Rejected
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                  onClick={() => toggleDetails(job._id)}
                >
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-800">
                      {job.jobInfo?.jobTitle || "Job Title"}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {job.jobInfo?.companyName || "Company"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status
                        ? job.status.charAt(0).toUpperCase() +
                          job.status.slice(1)
                        : "Pending"}
                    </span>
                    {expandedDetails[job._id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
                {expandedDetails[job._id] && (
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Applied On</p>
                        <p className="font-medium">{job.appliedDate || "-"}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500">Cover Letter</p>
                      <p className="text-gray-700">
                        {job.jobSeekerInfo?.coverLetter || "-"}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View Full Application
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No job applications match your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobApplications;
