// EmployerDashboard.jsx - Main dashboard layout component
import React, { useState } from 'react';
import { 
  FaTh, FaBriefcase, FaUserTie, FaFileAlt, 
  FaChartBar, FaCog, FaSignOutAlt, FaBell, 
  FaEye, FaCheckCircle, FaUserPlus, FaCheck 
} from 'react-icons/fa';
import VacancyManagement from './VacancyManagement';
import ApplicationManagement from './ApplicationManagement';
// import ResumeViewer from './ResumeViewer';
// import Analytics from './Analytics';
// import Settings from './Settings';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Function to render the content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'vacancies':
        return <VacancyManagement />;
      case 'applications':
        return <ApplicationManagement />;
      case 'resumes':
        return <ResumeViewer />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen mx-auto">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">JobPortal</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2">
                <span className="text-sm">Notifications</span>
                <FaBell />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <img 
                src="https://via.placeholder.com/40" 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">Employer Name</span>
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
              src="https://via.placeholder.com/50" 
              alt="Company Logo" 
              className="w-12 h-12 rounded mr-3"
            />
            <div>
              <h3 className="font-bold text-gray-800">Company Name</h3>
              <p className="text-xs text-gray-500">Premium Employer</p>
            </div>
          </div>
          
          <nav>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaTh className="w-5" />
                  <span className="ml-3">Dashboard</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('vacancies')}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === 'vacancies' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaBriefcase className="w-5" />
                  <span className="ml-3">Vacancies</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('applications')}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === 'applications' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaUserTie className="w-5" />
                  <span className="ml-3">Applications</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">12</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('resumes')}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === 'resumes' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaFileAlt className="w-5" />
                  <span className="ml-3">Resumes</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaChartBar className="w-5" />
                  <span className="ml-3">Analytics</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeTab === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaCog className="w-5" />
                  <span className="ml-3">Settings</span>
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto pt-6">
            <button className="flex items-center w-full p-3 rounded-md text-red-600 hover:bg-red-50">
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
const DashboardHome = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Employer Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBriefcase className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-gray-500 text-sm">Active Vacancies</h4>
              <p className="text-2xl font-bold text-gray-800">8</p>
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
              <p className="text-2xl font-bold text-gray-800">12</p>
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
              <p className="text-2xl font-bold text-gray-800">324</p>
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
              <p className="text-2xl font-bold text-gray-800">5</p>
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
          <div className="flex items-start p-3 hover:bg-gray-50 rounded-md">
            <div className="bg-blue-100 p-2 rounded-full">
              <FaUserPlus className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-800">New application for <span className="font-medium">Senior Developer</span></p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
            <div className="ml-auto">
              <button className="text-blue-600 text-sm">Review</button>
            </div>
          </div>
          
          <div className="flex items-start p-3 hover:bg-gray-50 rounded-md">
            <div className="bg-green-100 p-2 rounded-full">
              <FaCheck className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-800">You approved <span className="font-medium">John Doe</span> for interview</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-start p-3 hover:bg-gray-50 rounded-md">
            <div className="bg-purple-100 p-2 rounded-full">
              <FaBriefcase className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-gray-800">You posted a new job: <span className="font-medium">UI/UX Designer</span></p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
            <div className="ml-auto">
              <button className="text-blue-600 text-sm">View</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;