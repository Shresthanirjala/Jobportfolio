// VacancyManagement.jsx - Component for managing job vacancies
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaSort,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify"; // Import toast for notifications

const VacancyManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [editVacancyId, setEditVacancyId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [vacancies, setVacancies] = useState([]);

  // New vacancy form state
  const [newVacancy, setNewVacancy] = useState({
    title: "",
    jobType: "Full-time",
    location: "",
    companyName: "",
    introduction: "",
    responsibilities: "",
    qualifications: "",
    offers: "",
    salary: "",
    hiringMultipleCandidates: false,
    personalWebsiteTitle: "",
    personalWebsiteUrl: "",
    jobNiche: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobs = async () => {
    setIsFetching(true);
    try {
      // Get token from user context or localStorage.user
      let token = localStorage.getItem("authToken");
      if (!token) {
        // Try to get from user object if using AuthContext
        const storedUser = JSON.parse(localStorage.getItem("user"));
        token = storedUser?.token || storedUser?.authToken || null;
      }
      if (!token) {
        toast.error("You are not logged in. Please login first.");
        setIsFetching(false);
        return;
      }
      const response = await axios.get(
        "http://localhost:3000/api/v1/job/getmyjobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetched data:", response.data); // Debug log

      if (response.data.success) {
        // Use the correct property from backend response (myJobs or jobs)
        const jobsArray = response.data.myJobs || response.data.jobs || [];

        const transformedJobs = jobsArray.map((job) => ({
          id: job._id,
          title: job.title,
          jobType: job.jobType,
          location: job.location,
          companyName: job.companyName,
          introduction: job.introduction,
          responsibilities: job.responsibilities,
          qualifications: job.qualifications,
          offers: job.offers,
          salary: job.salary,
          hiringMultipleCandidates: job.hiringMultipleCandidates === "Yes",
          personalWebsites: {
            title: job.personalWebsites?.title || "",
            url: job.personalWebsites?.url || "",
          },
          jobNiche: job.jobNiche,
          jobKeywords: Array.isArray(job.jobKeywords) ? job.jobKeywords : [],
          postedDate: new Date(job.jobPostedOn || job.createdAt)
            .toISOString()
            .split("T")[0],
          status: job.status || "Active",
          applicants: job.applications?.length || 0,
        }));

        setVacancies(transformedJobs);
      } else {
        toast.error("Failed to fetch jobs.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to fetch jobs.");
    } finally {
      setIsFetching(false);
    }
  };
  // Handle input changes for the new vacancy form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "hiringMultipleCandidates") {
      setNewVacancy({
        ...newVacancy,
        [name]: e.target.checked,
      });
    } else {
      setNewVacancy({
        ...newVacancy,
        [name]: value,
      });
    }
  };

  const handleAddVacancy = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert jobKeywords string to array and format data according to schema
    const formattedData = {
      title: newVacancy.title,
      jobType: newVacancy.jobType,
      location: newVacancy.location,
      companyName: newVacancy.companyName,
      introduction: newVacancy.introduction,
      responsibilities: newVacancy.responsibilities,
      qualifications: newVacancy.qualifications,
      offers: newVacancy.offers,
      salary: newVacancy.salary,
      hiringMultipleCandidates: newVacancy.hiringMultipleCandidates, // boolean as per schema
      personalWebsiteTitle: newVacancy.personalWebsiteTitle || "",
      personalWebsiteUrl: newVacancy.personalWebsiteUrl || "",
      jobNiche: newVacancy.jobNiche || "",
      jobKeywords: newVacancy.jobKeywords
        ? newVacancy.jobKeywords
            .split(",")
            .map((kw) => kw.trim())
            .filter((kw) => kw.length > 0)
        : [],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/job/post",
        formattedData, // send formattedData here
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.success) {
        const newJob = response.data.job;

        setVacancies([
          ...vacancies,
          {
            id: newJob._id,
            title: newJob.title,
            jobType: newJob.jobType,
            location: newJob.location,
            companyName: newJob.companyName,
            introduction: newJob.introduction,
            responsibilities: newJob.responsibilities,
            qualifications: newJob.qualifications,
            offers: newJob.offers,
            salary: newJob.salary,
            hiringMultipleCandidates: newJob.hiringMultipleCandidates,
            personalWebsites: {
              title: newJob.personalWebsites?.title || "",
              url: newJob.personalWebsites?.url || "",
            },
            jobKeywords: newJob.jobKeywords,
            jobNiche: newJob.jobNiche,
            postedDate: new Date(newJob.jobPostedOn)
              .toISOString()
              .split("T")[0],
            status: "Active",
            applicants: 0,
          },
        ]);

        setIsAddModalOpen(false);
        resetForm();
        toast.success("Job posted successfully!");
      } else {
        toast.error("Failed to post the job.");
      }
    } catch (error) {
      console.error("Error adding vacancy:", error);
      toast.error(error.response?.data?.message || "Failed to add job.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewVacancy({
      title: "",
      jobType: "Full-time",
      location: "",
      companyName: "",
      introduction: "",
      responsibilities: "",
      qualifications: "",
      offers: "",
      salary: "",
      hiringMultipleCandidates: false,
      personalWebsiteTitle: "",
      jobKeywords: "",
      personalWebsiteUrl: "",
      jobNiche: "",
    });
  };

  // Handle deleting a vacancy
  const handleDeleteVacancy = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vacancy?")) {
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You are not logged in. Please login first.");
        return;
      }

      await axios.delete(`http://localhost:3000/api/v1/job/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVacancies((prev) => prev.filter((vacancy) => vacancy.id !== id));
      toast.success("Vacancy deleted successfully!");
    } catch (error) {
      console.error("Error deleting vacancy:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to delete vacancy.");
    }
  };

  // Handle editing a vacancy
  const handleEditClick = (vacancy) => {
    // Extract personalWebsite fields
    const formattedVacancy = {
      ...vacancy,
      personalWebsiteTitle: vacancy.personalWebsite?.title || "",
      personalWebsiteUrl: vacancy.personalWebsite?.url || "",
    };

    setNewVacancy(formattedVacancy);
    setEditVacancyId(vacancy.id);
    setIsEditModalOpen(true);
  };

  // Handle saving edited vacancy
  const handleSaveEdit = (e) => {
    e.preventDefault();

    const updatedVacancy = {
      ...newVacancy,
      personalWebsite: {
        title: newVacancy.personalWebsiteTitle || "",
        url: newVacancy.personalWebsiteUrl || "",
      },
    };

    // Remove the separate personalWebsiteTitle and personalWebsiteUrl fields
    delete updatedVacancy.personalWebsiteTitle;
    delete updatedVacancy.personalWebsiteUrl;

    setVacancies(
      vacancies.map((vacancy) =>
        vacancy.id === editVacancyId ? updatedVacancy : vacancy
      )
    );

    setIsEditModalOpen(false);
    setEditVacancyId(null);
    resetForm();
  };

  // Filter vacancies based on search query
  const filteredVacancies = vacancies.filter(
    (vacancy) =>
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.jobKeywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.jobNiche.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vacancy Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add New Vacancy
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search vacancies..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Job Niches</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Full Stack Development">
                Full Stack Development
              </option>
            </select>

            <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vacancies Table */}
      {/* Search Bar */}
      {/* <div className="mb-4">
  <input
    type="text"
    placeholder="Search jobs by title..."
    className="px-4 py-2 border rounded w-full md:w-1/3"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div> */}

      {/* Vacancies Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isFetching ? (
            <p className="text-center py-4">Loading jobs...</p>
          ) : filteredVacancies.length === 0 ? (
            <p className="text-center py-4">No vacancies found.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Job Title <FaSort className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Company <FaSort className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Location <FaSort className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Job Type</div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Job Keywords</div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Job Niche</div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">
                      Posted Date <FaSort className="ml-1" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Status</div>
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center">Applicants</div>
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVacancies.map((vacancy) => (
                  <tr key={vacancy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {vacancy.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vacancy.companyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vacancy.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vacancy.jobType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vacancy.jobKeywords?.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vacancy.jobNiche}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vacancy.postedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    vacancy.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : vacancy.status === "Paused"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                      >
                        {vacancy.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {vacancy.applicants}
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleEditClick(vacancy)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteVacancy(vacancy.id)}
                        >
                          <FaTrash />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add New Vacancy Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Add New Vacancy
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddVacancy}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newVacancy.title}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={newVacancy.companyName}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newVacancy.location}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type*
                  </label>
                  <select
                    name="jobType"
                    value={newVacancy.jobType}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {/* Match only allowed enum values from schema */}
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Niche*
                  </label>
                  <input
                    type="text"
                    name="jobNiche"
                    value={newVacancy.jobNiche}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g. Frontend Development, UX Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Keywords*
                  </label>
                  <input
                    type="text"
                    name="jobKeywords"
                    value={newVacancy.jobKeywords}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="e.g. Frontend Development, UX Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range*
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={newVacancy.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. Rs60,000 - Rs80,000"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="hiringMultipleCandidates"
                    name="hiringMultipleCandidates"
                    checked={newVacancy.hiringMultipleCandidates}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="hiringMultipleCandidates"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Hiring Multiple Candidates
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Website Title
                  </label>
                  <input
                    type="text"
                    name="personalWebsiteTitle"
                    value={newVacancy.personalWebsiteTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Company Careers Page"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Personal Website URL
                  </label>
                  <input
                    type="text"
                    name="personalWebsiteUrl"
                    value={newVacancy.personalWebsiteUrl}
                    onChange={handleInputChange}
                    placeholder="e.g. https://company.com/careers"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Introduction*
                </label>
                <textarea
                  name="introduction"
                  value={newVacancy.introduction}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Brief introduction to the job position"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities*
                </label>
                <textarea
                  name="responsibilities"
                  value={newVacancy.responsibilities}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Key responsibilities for this position"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualifications*
                </label>
                <textarea
                  name="qualifications"
                  value={newVacancy.qualifications}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Required qualifications and skills"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offers
                </label>
                <textarea
                  name="offers"
                  value={newVacancy.offers}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What your company offers (benefits, perks, etc.)"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {isLoading ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <FaSave className="inline mr-2" /> Save Vacancy
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vacancy Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Vacancy</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Edit form fields (simplified for brevity - should match add form) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newVacancy.title}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Add remaining fields similar to Add Vacancy form */}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaSave className="inline mr-2" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancyManagement;
