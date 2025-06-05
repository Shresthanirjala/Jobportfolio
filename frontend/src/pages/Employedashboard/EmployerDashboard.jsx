// EmployerDashboard.jsx - Main dashboard layout component with mock data
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaTh,
  FaBriefcase,
  FaUserTie,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaEye,
  FaCheckCircle,
  FaUserPlus,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import VacancyManagement from "./VacancyManagement";
import ApplicationManagement from "./ApplicationManagement";
import EmployerNavbar from "./EmployerNavbar";

// Mock data
const mockEmployerData = {
  id: "1",
  name: "Tech Solutions Inc.",
  logo: "https://via.placeholder.com/50",
  subscription: "Premium",
  email: "contact@techsolutions.com",
  industry: "Technology"
};

const mockStats = {
  activeVacancies: 12,
  newApplications: 8,
  jobViews: 1243,
  hired: 5
};

const mockRecentActivity = [
  {
    type: "application",
    message: "<strong>John Doe</strong> applied for <strong>Frontend Developer</strong> position",
    time: "2 hours ago",
    iconColor: "blue",
    action: "View"
  },
  {
    type: "job_post",
    message: "New job posting <strong>Backend Developer</strong> was published",
    time: "1 day ago",
    iconColor: "green",
    action: null
  },
  {
    type: "approval",
    message: "<strong>Sarah Johnson</strong> was hired for <strong>UI/UX Designer</strong>",
    time: "2 days ago",
    iconColor: "yellow",
    action: null
  }
];

// Loading component
const LoadingState = ({ fullScreen }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen w-full" : "h-full w-full py-20"
      }`}
    >
      <div className="text-center">
        <FaSpinner className="animate-spin text-blue-600 mx-auto h-8 w-8" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

// Error component
const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">{message}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

const EmployerDashboard = () => {
  const { id } = useParams(); // Get the employer ID from URL parameters
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    activeVacancies: 0,
    newApplications: 0,
    jobViews: 0,
    hired: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  // Fetch employer data based on ID
  useEffect(() => {
    const fetchEmployerData = async () => {
      if (!id) {
        setError("No employer ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if we should use mock data or try real API
        const USE_MOCK_DATA = true; // Set to false when you have real API
        
        if (USE_MOCK_DATA) {
          // Use mock data
          setEmployer(mockEmployerData);
          setStats(mockStats);
          setRecentActivity(mockRecentActivity);
          setLoading(false);
          return;
        }
        
        // Real API calls (uncomment when backend is ready)
        /*
        const response = await fetch(`/api/employers/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch employer data: ${response.status}`);
        }
        const data = await response.json();
        setEmployer(data);

        // Fetch employer stats
        const statsResponse = await fetch(`/api/employers/${id}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch recent activity
        const activityResponse = await fetch(`/api/employers/${id}/activity`);
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setRecentActivity(activityData);
        }
        */

        setLoading(false);
      } catch (err) {
        console.error("Error fetching employer data:", err);
        setError("Failed to load employer data. Please try again later.");
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, [id]);

  // Function to handle logout
  const handleLogout = () => {
    // Add your logout logic here (clear tokens, session, etc.)
    localStorage.removeItem("token"); // Example: Remove auth token
    navigate("/login"); // Redirect to login page
  };

  // Function to retry loading data
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger useEffect again by updating a dependency or call fetchEmployerData directly
    window.location.reload();
  };

  // Function to render the content based on active tab
  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} onRetry={handleRetry} />;
    }

    if (!employer) {
      return <ErrorState message="Employer not found" onRetry={handleRetry} />;
    }

    switch (activeTab) {
      case "vacancies":
        return <VacancyManagement employerId={id} />;
      case "applications":
        return <ApplicationManagement employerId={id} />;
      case "resumes":
        return <div className="text-center py-8 text-gray-500">Resume Viewer Component (Coming Soon)</div>;
      case "analytics":
        return <div className="text-center py-8 text-gray-500">Analytics Component (Coming Soon)</div>;
      case "settings":
        return <div className="text-center py-8 text-gray-500">Settings Component (Coming Soon)</div>;
      default:
        return (
          <DashboardHome
            employer={employer}
            stats={stats}
            recentActivity={recentActivity}
          />
        );
    }
  };

  if (loading) {
    return <LoadingState fullScreen={true} />;
  }

  return (
    <div className="bg-gray-100 min-h-screen mx-auto">
      <EmployerNavbar />
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">JobPortal</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2">
                <span className="text-sm">Notifications</span>
                <FaBell />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.newApplications > 0 ? stats.newApplications : 0}
                </span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={employer?.logo || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">
                {employer?.name || "Loading..."}
              </span>
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto flex">
        {/* Sidebar */}
        <div className="bg-white w-64 shadow-md p-4 h-[calc(100vh-64px)]">
          <div className="company-info flex items-center p-3 mb-6 bg-blue-50 rounded-md">
            <img
              src={employer?.logo || "https://via.placeholder.com/50"}
              alt="Company Logo"
              className="w-12 h-12 rounded mr-3"
            />
            <div>
              <h3 className="font-bold text-gray-800">
                {employer?.name || "Company Name"}
              </h3>
              <p className="text-xs text-gray-500">
                {employer?.subscription || "Standard"} Employer
              </p>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === "dashboard"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaTh className="w-5" />
                  <span className="ml-3">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("vacancies")}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === "vacancies"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaBriefcase className="w-5" />
                  <span className="ml-3">Vacancies</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("applications")}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === "applications"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaUserTie className="w-5" />
                  <span className="ml-3">Applications</span>
                  {stats.newApplications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {stats.newApplications}
                    </span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("resumes")}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === "resumes"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaFileAlt className="w-5" />
                  <span className="ml-3">Resumes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === "analytics"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaChartBar className="w-5" />
                  <span className="ml-3">Analytics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === "settings"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FaCog className="w-5" />
                  <span className="ml-3">Settings</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-md text-red-600 hover:bg-red-50"
            >
              <FaSignOutAlt className="w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 h-[calc(100vh-64px)] overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard home component for the main dashboard view
const DashboardHome = ({ employer, stats, recentActivity }) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {employer?.name || "Employer"}
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBriefcase className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm">Active Vacancies</h4>
              <p className="text-2xl font-bold text-gray-800">
                {stats.activeVacancies}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FaUserTie className="text-green-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm">New Applications</h4>
              <p className="text-2xl font-bold text-gray-800">
                {stats.newApplications}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FaEye className="text-purple-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm">Job Views</h4>
              <p className="text-2xl font-bold text-gray-800">
                {stats.jobViews}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaCheckCircle className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm">Hired</h4>
              <p className="text-2xl font-bold text-gray-800">{stats.hired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
          <button className="text-blue-600 text-sm">View All</button>
        </div>

        <div className="space-y-4">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start p-3 hover:bg-gray-50 rounded-md"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  {activity.type === "application" && (
                    <FaUserPlus className="text-blue-600" />
                  )}
                  {activity.type === "approval" && (
                    <FaCheck className="text-green-600" />
                  )}
                  {activity.type === "job_post" && (
                    <FaBriefcase className="text-purple-600" />
                  )}
                </div>
                <div className="ml-4">
                  <p
                    className="text-gray-800"
                    dangerouslySetInnerHTML={{ __html: activity.message }}
                  />
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                {activity.action && (
                  <div className="ml-auto">
                    <button className="text-blue-600 text-sm">
                      {activity.action}
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;