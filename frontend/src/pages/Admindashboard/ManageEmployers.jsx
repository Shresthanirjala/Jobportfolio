import React, { useState, useEffect } from "react";
import {
  Building,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { BASE_URL } from "../../config/config";

const ManageEmployers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employers from API on component mount
  useEffect(() => {
    const fetchEmployers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken"); // If you use auth token
        const res = await axios.get(`${BASE_URL}api/v1/admin/employers`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        // Adjust to your API response data structure
        setEmployers(res.data?.employers || []);
      } catch (err) {
        console.error("Error fetching employers:", err);
        setError("Failed to fetch employers");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "suspended":
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "active":
      case "verified":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "suspended":
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleDeleteEmployer = async (employerId) => {
    if (!window.confirm("Are you sure you want to delete this employer?")) {
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${BASE_URL}api/v1/admin/user/${employerId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setEmployers((prev) =>
        prev.filter((employer) => employer._id !== employerId)
      );
    } catch (err) {
      alert("Failed to delete employer. Please try again.");
      console.error("Error deleting employer:", err);
    }
  };

  // Filter employers based on search and status filter
  const filteredEmployers = employers.filter((employer) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      employer.companyName?.toLowerCase().includes(lowerSearch) ||
      employer.contactPerson?.toLowerCase().includes(lowerSearch) ||
      employer.email?.toLowerCase().includes(lowerSearch);
    const matchesFilter =
      filterStatus === "all" || employer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-20">
        Loading employers...
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
          <h2 className="text-2xl font-bold text-gray-900">Manage Employers</h2>
          <p className="text-gray-600">
            Manage and monitor all registered employers
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Employers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {employers.length}
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
              <p className="text-sm font-medium text-gray-600">
                Active Employers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {employers.filter((e) => e.status === "active").length}
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
              <p className="text-sm font-medium text-gray-600">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {employers.filter((e) => e.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {employers.reduce(
                  (sum, employer) => sum + (employer.activeJobs || 0),
                  0
                )}
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
                placeholder="Search employers by company name, contact person, or email..."
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
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Employers Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Employers List
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location & Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jobs/Applications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployers.map((employer) => (
                <tr key={employer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employer.companyName || employer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employer.employeeCount} employees
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employer.contactPerson}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employer.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-3 h-3 mr-1" />
                      {employer.location}
                    </div>
                    <div className="text-sm text-gray-500">
                      {employer.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employer.activeJobs} active jobs
                    </div>
                    <div className="text-sm text-gray-500">
                      {employer.totalApplications} applications
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteEmployer(employer._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEmployers.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No employers found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEmployers;
