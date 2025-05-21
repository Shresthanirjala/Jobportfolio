import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  Download,
  Edit,
  Save,
  X,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";

const JobSeekerProfile = () => {
  // Initial state based on your backend structure
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    address: "San Francisco, CA",
    coverLetter:
      "I am a dedicated software developer with 5+ years of experience in web development. I specialize in creating robust and user-friendly applications using modern technologies. I'm passionate about solving complex problems and delivering high-quality code that meets business requirements.",
    niches: {
      firstNiche: "Web Development",
      secondNiche: "Frontend Engineering",
      thirdNiche: "UI/UX Design",
    },
    resume: {
      public_id: "Job_Seeker_resume/alex_resume",
      url: "https://example.com/resume.pdf",
      name: "Alex_Johnson_Resume.pdf",
      uploadDate: "May 1, 2025",
    },
    // Additional data for display purposes
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "HTML/CSS",
      "UI Design",
      "TypeScript",
      "Redux",
      "Git",
      "REST APIs",
      "Responsive Design",
    ],
    experience: [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "Tech Solutions Inc.",
        location: "San Francisco, CA",
        startDate: "Jan 2022",
        endDate: "Present",
        description:
          "Lead developer for multiple client projects, specializing in React applications.",
      },
      {
        id: 2,
        title: "Web Developer",
        company: "Digital Innovations",
        location: "San Jose, CA",
        startDate: "Mar 2019",
        endDate: "Dec 2021",
        description:
          "Developed and maintained e-commerce websites and web applications.",
      },
    ],
    education: [
      {
        id: 1,
        degree: "B.S. Computer Science",
        institution: "University of California",
        location: "Berkeley, CA",
        startDate: "2015",
        endDate: "2019",
      },
    ],
    // New job applications data
    jobApplications: [
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
    ],
  });

  // State for active editing sections
  const [editing, setEditing] = useState({
    profile: false,
    niches: false,
  });

  // Temporary state for editing
  const [editData, setEditData] = useState({});

  // State for job applications filter
  const [jobFilter, setJobFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDetails, setExpandedDetails] = useState({});

  // Job application statistics
  const totalApplications = profileData.jobApplications.length;
  const pendingApplications = profileData.jobApplications.filter(
    (job) => job.status === "Pending"
  ).length;
  const approvedApplications = profileData.jobApplications.filter(
    (job) =>
      job.status === "Approved for Interview" ||
      job.status === "Interview Scheduled"
  ).length;
  const rejectedApplications = profileData.jobApplications.filter(
    (job) => job.status === "Rejected"
  ).length;

  // Start editing profile
  const startEditingProfile = () => {
    setEditData({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      coverLetter: profileData.coverLetter,
    });
    setEditing({ ...editing, profile: true });
  };

  // Start editing niches
  const startEditingNiches = () => {
    setEditData({
      firstNiche: profileData.niches.firstNiche,
      secondNiche: profileData.niches.secondNiche,
      thirdNiche: profileData.niches.thirdNiche,
    });
    setEditing({ ...editing, niches: true });
  };

  // Cancel editing
  const cancelEditing = (section) => {
    setEditing({ ...editing, [section]: false });
  };

  // Save profile changes
  const saveProfile = () => {
    setProfileData({
      ...profileData,
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      address: editData.address,
      coverLetter: editData.coverLetter,
    });
    setEditing({ ...editing, profile: false });
  };

  // Save niches changes
  const saveNiches = () => {
    setProfileData({
      ...profileData,
      niches: {
        firstNiche: editData.firstNiche,
        secondNiche: editData.secondNiche,
        thirdNiche: editData.thirdNiche,
      },
    });
    setEditing({ ...editing, niches: false });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle resume upload
  const handleResumeUpload = () => {
    // In a real app, this would trigger a file input and handle the upload
    // This would connect to your updateProfile controller
    console.log("Resume upload triggered");

    // For demo purposes only - would be handled by your backend
    setProfileData({
      ...profileData,
      resume: {
        ...profileData.resume,
        name: "New_Resume_AlexJohnson.pdf",
        uploadDate: "May 4, 2025",
      },
    });
  };

  // Toggle job application details
  const toggleDetails = (id) => {
    setExpandedDetails({
      ...expandedDetails,
      [id]: !expandedDetails[id],
    });
  };

  // Filter job applications based on status and search term
  const filteredJobs = profileData.jobApplications.filter((job) => {
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

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

      {/* Personal Information Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Personal Information
          </h2>
          {!editing.profile ? (
            <button
              onClick={startEditingProfile}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => cancelEditing("profile")}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {!editing.profile ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <User className="w-5 h-5 mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{profileData.name}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="w-5 h-5 mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profileData.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-5 h-5 mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profileData.phone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mt-1 mr-3 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{profileData.address}</p>
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-2">Cover Letter</p>
              <p className="text-gray-700 bg-gray-50 p-4 rounded border border-gray-100">
                {profileData.coverLetter}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={editData.name || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={editData.phone || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={editData.address || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2"
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={editData.coverLetter || ""}
                onChange={handleInputChange}
                rows="5"
                className="border border-gray-300 rounded p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Job Niches Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Preferred Job Niches
          </h2>
          {!editing.niches ? (
            <button
              onClick={startEditingNiches}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Niches
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveNiches}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={() => cancelEditing("niches")}
                className="flex items-center text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {!editing.niches ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center">
              <Briefcase className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-700">Primary Niche</p>
                <p className="font-semibold text-blue-800">
                  {profileData.niches.firstNiche}
                </p>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center">
              <Briefcase className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-purple-700">Secondary Niche</p>
                <p className="font-semibold text-purple-800">
                  {profileData.niches.secondNiche}
                </p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
              <Briefcase className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-700">Tertiary Niche</p>
                <p className="font-semibold text-green-800">
                  {profileData.niches.thirdNiche}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">
                Primary Niche
              </label>
              <input
                type="text"
                name="firstNiche"
                value={editData.firstNiche || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2"
                placeholder="E.g. Web Development"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">
                Secondary Niche
              </label>
              <input
                type="text"
                name="secondNiche"
                value={editData.secondNiche || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2"
                placeholder="E.g. Frontend Engineering"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">
                Tertiary Niche
              </label>
              <input
                type="text"
                name="thirdNiche"
                value={editData.thirdNiche || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2"
                placeholder="E.g. UI/UX Design"
              />
            </div>
          </div>
        )}
      </div>

      {/* Resume Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Resume</h2>
          <div>
            <label
              htmlFor="resume-upload"
              className="flex items-center text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload New Resume
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
          <FileText className="w-10 h-10 text-blue-500 mr-4" />
          <div className="flex-grow">
            <p className="font-medium">{profileData.resume.name}</p>
            <p className="text-sm text-gray-500">
              Uploaded on {profileData.resume.uploadDate}
            </p>
          </div>
          <a
            href={profileData.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </a>
        </div>
      </div>

      {/* Skills Section - From Resume */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Skills</h2>
          <p className="text-sm text-gray-500">
            Skills extracted from your resume
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Work Experience Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Work Experience
        </h2>

        {profileData.experience.map((exp) => (
          <div
            key={exp.id}
            className="mb-6 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
          >
            <div>
              <h3 className="font-semibold text-lg">{exp.title}</h3>
              <p className="text-gray-700">
                {exp.company} • {exp.location}
              </p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.endDate}
              </p>
              <p className="mt-2 text-gray-600">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Education Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Education</h2>

        {profileData.education.map((edu) => (
          <div
            key={edu.id}
            className="mb-6 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
          >
            <div>
              <h3 className="font-semibold text-lg">{edu.degree}</h3>
              <p className="text-gray-700">
                {edu.institution} • {edu.location}
              </p>
              <p className="text-sm text-gray-500">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSeekerProfile;
