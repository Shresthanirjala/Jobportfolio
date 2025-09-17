import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { BASE_URL } from "../../config/config";

const ManageApplications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJob, setFilterJob] = useState("all");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${BASE_URL}api/v1/admin/applications`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        // Assuming backend returns raw data as per your schema
        setApplications(res.data?.applications || []);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Unique job titles for filtering
  const jobs = [...new Set(applications.map((app) => app.jobInfo.jobTitle))];

  // Status icon, matching backend enum
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Status badge styles, matching backend enum
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Change application status locally (for demo)
  const handleStatusChange = (appId, newStatus) => {
    setApplications(
      applications.map((app) =>
        app._id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  // Delete application locally (for demo)
  const handleDeleteApplication = (appId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      setApplications(applications.filter((app) => app._id !== appId));
    }
  };

  // Placeholder for downloading resume
  const handleDownloadResume = (resumeUrl, applicantName) => {
    alert(`Downloading resume for ${applicantName}`);
  };

  // Filtered and searched applications based on nested fields
  const filteredApplications = applications.filter((app) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesSearch =
      app.jobSeekerInfo.name.toLowerCase().includes(lowerSearch) ||
      app.jobSeekerInfo.email.toLowerCase().includes(lowerSearch) ||
      app.jobInfo.jobTitle.toLowerCase().includes(lowerSearch);
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesJob =
      filterJob === "all" || app.jobInfo.jobTitle === filterJob;

    return matchesSearch && matchesStatus && matchesJob;
  });

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-20">
        Loading applications...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminNavbar />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Applications
          </h2>
          <p className="text-gray-600">
            Review and manage all job applications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((a) => a.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((a) => a.status === "approved").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by applicant name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <select
              value={filterJob}
              onChange={(e) => setFilterJob(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Jobs</option>
              {jobs.map((job) => (
                <option key={job} value={job}>
                  {job}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Applications List
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.jobSeekerInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {/* Add more fields here if available */}
                          ID: {application.jobSeekerInfo.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 mb-1">
                      <Mail className="w-3 h-3 mr-1 text-gray-400" />
                      {application.jobSeekerInfo.email}
                    </div>
                    {/* Phone is not in your schema, so omitted */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 mb-1">
                      <Briefcase className="w-3 h-3 mr-1 text-gray-400" />
                      {application.jobInfo.jobTitle}
                    </div>
                    {/* Assuming employerInfo.companyName or similar is available, otherwise omit */}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <span className={getStatusBadge(application.status)}>
                        {application.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        onClick={() => handleDeleteApplication(application._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No applications found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;
