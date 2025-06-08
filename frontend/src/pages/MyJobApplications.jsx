import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

const MyJobApplications = () => {
  // Job applications data
  const [jobApplications] = useState([
    {
      id: 1,
      company: "Innovate Tech",
      position: "Senior Frontend Developer",
      location: "San Francisco, CA",
      appliedDate: "May 2, 2025",
      status: "Pending",
      description:
        "Full-time position focused on React and modern frontend technologies.",
    },
    {
      id: 2,
      company: "Digital Solutions Co.",
      position: "UI/UX Developer",
      location: "Remote",
      appliedDate: "May 1, 2025",
      status: "Approved for Interview",
      description:
        "Building responsive web applications with a focus on user experience.",
    },
    {
      id: 3,
      company: "WebCraft Studios",
      position: "React Developer",
      location: "San Jose, CA",
      appliedDate: "Apr 28, 2025",
      status: "Rejected",
      description:
        "Developing and maintaining client-facing web applications.",
    },
    {
      id: 4,
      company: "TechGrowth Inc.",
      position: "Frontend Team Lead",
      location: "Oakland, CA",
      appliedDate: "Apr 25, 2025",
      status: "Interview Scheduled",
      interviewDate: "May 10, 2025",
      description:
        "Leading a team of 5 developers on various frontend projects.",
    },
    {
      id: 5,
      company: "App Builders",
      position: "Full Stack Developer",
      location: "San Francisco, CA",
      appliedDate: "Apr 20, 2025",
      status: "Pending",
      description:
        "Working with React frontend and Node.js backend for enterprise applications.",
    },
  ]);

  // State for job applications filter
  const [jobFilter, setJobFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDetails, setExpandedDetails] = useState({});

  // Job application statistics
  const totalApplications = jobApplications.length;
  const pendingApplications = jobApplications.filter(
    (job) => job.status === "Pending"
  ).length;
  const approvedApplications = jobApplications.filter(
    (job) =>
      job.status === "Approved for Interview" ||
      job.status === "Interview Scheduled"
  ).length;
  const rejectedApplications = jobApplications.filter(
    (job) => job.status === "Rejected"
  ).length;

  // Toggle job application details
  const toggleDetails = (id) => {
    setExpandedDetails({
      ...expandedDetails,
      [id]: !expandedDetails[id],
    });
  };

  // Filter job applications based on status and search term
  const filteredJobs = jobApplications.filter((job) => {
    const matchesStatus =
      jobFilter === "all" ||
      (jobFilter === "pending" && job.status === "Pending") ||
      (jobFilter === "approved" &&
        (job.status === "Approved for Interview" ||
          job.status === "Interview Scheduled")) ||
      (jobFilter === "rejected" && job.status === "Rejected");

    const matchesSearch =
      searchTerm === "" ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Approved for Interview":
      case "Interview Scheduled":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Job Applications</h1>

      {/* Job Applications Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Job Applications Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-700">Total Applications</p>
            <p className="font-bold text-2xl text-blue-800">
              {totalApplications}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="font-bold text-2xl text-yellow-800">
              {pendingApplications}
            </p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <p className="text-sm text-green-700">Approved/Interviews</p>
            <p className="font-bold text-2xl text-green-800">
              {approvedApplications}
            </p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <p className="text-sm text-red-700">Rejected</p>
            <p className="font-bold text-2xl text-red-800">
              {rejectedApplications}
            </p>
          </div>
        </div>

        {/* Job Applications List */}
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-700 mb-3">
            My Applications
          </h3>

          {/* Filter and Search */}
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

          {/* Job Applications */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleDetails(job.id)}
                  >
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-800">
                        {job.position}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                      {expandedDetails[job.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {expandedDetails[job.id] && (
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Applied On</p>
                          <p className="font-medium">{job.appliedDate}</p>
                        </div>
                        {job.interviewDate && (
                          <div>
                            <p className="text-sm text-gray-500">
                              Interview Date
                            </p>
                            <p className="font-medium">{job.interviewDate}</p>
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Job Description</p>
                        <p className="text-gray-700">{job.description}</p>
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
    </div>
  );
};

export default MyJobApplications;