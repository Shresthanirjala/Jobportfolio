// ApplicationManagement.jsx - Component for managing job applications
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaSort,
  FaEllipsisV,
  FaFilePdf,
  FaCheck,
  FaTimes,
  FaClock,
  FaTrash,
  FaStar,
  FaRegStar,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { BASE_URL } from "../../config/config";

const ApplicationManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewingResume, setViewingResume] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${BASE_URL}api/v1/application/employer/getall`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApplications(response.data.application || []);
      } catch (err) {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Handle approving an application
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}api/v1/application/status/${id}`,
        { status: "approved" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setApplications(
          applications.map((app) =>
            (app._id || app.id) === id ? { ...app, status: "approved" } : app
          )
        );
        if (
          selectedApplication &&
          (selectedApplication._id || selectedApplication.id) === id
        ) {
          setSelectedApplication({
            ...selectedApplication,
            status: "approved",
          });
        }
      }
    } catch (error) {
      // Optionally show error to user
      console.error("Failed to approve application", error);
    }
  };

  // Handle rejecting an application
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}api/v1/application/status/${id}`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setApplications(
          applications.map((app) =>
            (app._id || app.id) === id ? { ...app, status: "rejected" } : app
          )
        );
        if (
          selectedApplication &&
          (selectedApplication._id || selectedApplication.id) === id
        ) {
          setSelectedApplication({
            ...selectedApplication,
            status: "rejected",
          });
        }
      }
    } catch (error) {
      // Optionally show error to user
      console.error("Failed to reject application", error);
    }
  };

  // Handle accepting an application
  const handleAccept = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "approved" } : app
      )
    );

    // Update selected application if it's currently being viewed
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({ ...selectedApplication, status: "approved" });
    }
  };

  // Handle final rejection of an application
  const handleFinalReject = (id) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "final_rejected" } : app
      )
    );

    // Update selected application if it's currently being viewed
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({
        ...selectedApplication,
        status: "final_rejected",
      });
    }
  };

  // Handle deleting an application
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `${BASE_URL}api/v1/application/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setApplications(
          applications.filter((app) => (app._id || app.id) !== id)
        );
        if (
          selectedApplication &&
          (selectedApplication._id || selectedApplication.id) === id
        ) {
          setSelectedApplication(null);
        }
      }
    } catch (error) {
      // Optionally show error to user
      console.error("Failed to delete application", error);
    }
  };

  // Handle rating change
  const handleRating = (id, rating) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, rating } : app))
    );

    // Update selected application if it's currently being viewed
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({ ...selectedApplication, rating });
    }
  };

  // Handle note updates
  const handleNoteChange = (e) => {
    if (selectedApplication) {
      const updatedApplication = {
        ...selectedApplication,
        notes: e.target.value,
      };
      setSelectedApplication(updatedApplication);

      // Update the applications array
      setApplications(
        applications.map((app) =>
          app.id === selectedApplication.id ? updatedApplication : app
        )
      );
    }
  };

  // Filter applications based on active tab
  const filteredApplications = applications.filter((app) => {
    if (activeTab === "all") return true;
    return (app.status || "pending") === activeTab;
  });

  // Further filter by search query
  const searchFilteredApplications = filteredApplications.filter((app) => {
    const seeker = app.jobSeekerInfo || {};
    const job = app.jobInfo || {};
    return (
      (seeker.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.jobTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (seeker.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Application Management
        </h2>
        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {applications.filter((app) => app.status === "pending").length}{" "}
          pending applications
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Applications
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "pending"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "approved"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "rejected"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search applications by name, position, or email..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Applications List and Detail View */}
      <div className="flex-1 flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Applications List */}
        <div
          className={`w-full ${
            selectedApplication ? "hidden md:block md:w-2/5" : ""
          } overflow-y-auto`}
        >
          {searchFilteredApplications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {searchFilteredApplications.map((application) => (
                <li
                  key={application._id || application.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedApplication?._id === application._id ||
                    selectedApplication?.id === application.id
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedApplication(application);
                    setViewingResume(false);
                  }}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {application.jobSeekerInfo.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {application.jobInfo.jobTitle}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {application.status === "pending" && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Pending
                          </span>
                        )}
                        {application.status === "approved" && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Approved
                          </span>
                        )}
                        {application.status === "rejected" && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Rejected
                          </span>
                        )}
                        {application.status === "accepted" && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Accepted
                          </span>
                        )}
                        {application.status === "final_rejected" && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            Final Rejected
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-1" />
                      <span>Applied on {application.appliedDate}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No applications match your search criteria.
            </div>
          )}
        </div>

        {/* Application Detail View */}
        {selectedApplication && (
          <div
            className={`w-full ${
              selectedApplication ? "md:w-3/5" : ""
            } border-l border-gray-200 overflow-y-auto`}
          >
            {viewingResume ? (
              <div className="h-full">
                <div className="bg-gray-100 p-4 flex justify-between items-center">
                  <h3 className="font-medium">
                    {selectedApplication.jobSeekerInfo.name}'s Resume
                  </h3>
                  <button
                    onClick={() => setViewingResume(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Back to Application
                  </button>
                </div>
                <div className="p-6 flex items-center justify-center h-[calc(100%-60px)]">
                  {/* Placeholder for resume viewer */}
                  <div className="text-center">
                    <FaFilePdf className="text-red-500 text-5xl mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      {selectedApplication.resume}
                    </p>
                    <p className="text-gray-500 mb-4">
                      This is a placeholder for the resume viewer.
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                      Download Resume
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedApplication.jobSeekerInfo.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedApplication.jobSeekerInfo.email}
                    </p>
                    <p className="text-gray-600">
                      {selectedApplication.jobSeekerInfo.phone}
                    </p>
                    <p className="text-gray-600">
                      {selectedApplication.jobSeekerInfo.address}
                    </p>
                    <div className="mt-2">
                      {(() => {
                        const status = selectedApplication.status || "pending";
                        return (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${
                                status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : status === "accepted"
                                  ? "bg-blue-100 text-blue-800"
                                  : status === "final_rejected"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                          >
                            {status === "final_rejected"
                              ? "Final Rejected"
                              : status.charAt(0).toUpperCase() +
                                status.slice(1)}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Only show Approve/Reject if status is pending */}
                    {selectedApplication.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedApplication._id)}
                          className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 flex items-center gap-1"
                          title="Approve Candidate"
                        >
                          <FaCheckCircle />
                          <span className="text-sm">Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(selectedApplication._id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 flex items-center gap-1"
                          title="Reject Candidate"
                        >
                          <FaTimesCircle />
                          <span className="text-sm">Reject</span>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(selectedApplication._id)}
                      className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 flex items-center gap-1"
                      title="Delete Application"
                    >
                      <FaTrash />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                      <FaBriefcase className="mr-2" /> Applied Position
                    </h3>
                    <p className="text-gray-600">
                      {selectedApplication.jobInfo?.jobTitle}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2" /> Applied Date
                    </h3>
                    <p className="text-gray-600">
                      {selectedApplication.appliedDate}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">
                    Cover Letter
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-600">
                      {selectedApplication.jobSeekerInfo.coverLetter}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-gray-700">
                      Resume
                    </h3>
                    {selectedApplication.jobSeekerInfo.resume?.url && (
                      <a
                        href={selectedApplication.jobSeekerInfo.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <FaFilePdf className="mr-1" /> View Resume
                      </a>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">
                    Candidate Rating
                  </h3>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          handleRating(selectedApplication.id, star)
                        }
                        className="text-xl text-yellow-400 focus:outline-none"
                      >
                        {star <= selectedApplication.rating ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state when no application is selected */}
        {!selectedApplication && searchFilteredApplications.length > 0 && (
          <div className="hidden md:flex w-3/5 border-l border-gray-200 items-center justify-center p-6">
            <div className="text-center">
              <FaUser className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Application Selected
              </h3>
              <p className="text-gray-500">
                Select an application from the list to view details.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationManagement;
