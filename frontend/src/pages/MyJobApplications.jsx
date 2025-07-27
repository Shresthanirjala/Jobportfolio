import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import axios from "axios";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const MyJobApplications = () => {
  const [jobApplications, setJobApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobFilter, setJobFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDetails, setExpandedDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editCoverLetter, setEditCoverLetter] = useState("");
  const [editCV, setEditCV] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

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

  // Handle view full application
  const handleViewApplication = (job) => {
    setSelectedApplication(job);
    setEditCoverLetter(job.jobSeekerInfo?.coverLetter || "");
    setEditCV(job.jobSeekerInfo?.cv || "");
    setModalOpen(true);
    setEditError("");
  };

  // Handle edit and save
  const handleSaveEdit = async () => {
    if (!selectedApplication) return;
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:3000/api/v1/application/jobseeker/update/${selectedApplication._id}`,
        {
          coverLetter: editCoverLetter,
          cv: editCV,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpen(false);
      // Optionally, refresh applications
      window.location.reload();
    } catch (err) {
      setEditError("Failed to update application. Try again.");
    } finally {
      setEditLoading(false);
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
          {/* ...existing filter/search UI... */}
          <div className="flex gap-2">
            {/* ...existing filter buttons... */}
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
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        onClick={() => handleViewApplication(job)}
                      >
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
        {/* Modal for full application view/edit */}
        {modalOpen && selectedApplication && (
          <Modal onClose={() => setModalOpen(false)}>
            <div className="p-6 max-w-lg mx-auto">
              <h3 className="text-xl font-bold mb-4">Full Application</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                {selectedApplication.status === "pending" ? (
                  <textarea
                    value={editCoverLetter}
                    onChange={(e) => setEditCoverLetter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    rows={5}
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {editCoverLetter}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume (CV)
                </label>
                {/* Always show previously uploaded resume link if available */}
                {editCV && (
                  <div className="mb-2">
                    <a
                      href={editCV}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
                    >
                      View Resume
                    </a>
                  </div>
                )}
                {selectedApplication.status === "pending" && (
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      // Upload to Cloudinary
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append(
                        "upload_preset",
                        "YOUR_CLOUDINARY_PRESET"
                      );
                      try {
                        const res = await fetch(
                          "https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/auto/upload",
                          {
                            method: "POST",
                            body: formData,
                          }
                        );
                        const data = await res.json();
                        if (data.secure_url) {
                          setEditCV(data.secure_url);
                        }
                      } catch (err) {
                        alert("Failed to upload resume. Try again.");
                      }
                    }}
                  />
                )}
              </div>
              {editError && <p className="text-red-600 mb-2">{editError}</p>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </button>
                {selectedApplication.status === "pending" && (
                  <button
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MyJobApplications;
