import axios from "axios";
import React, { useEffect, useState } from "react";

const ApplyForm = ({ jobId, jobTitle, appliedJobIds = [], onClose }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/getuser", // change port if needed
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched user data:", response.data);
        const user = response.data.user;
        setFormData((prev) => ({
          ...prev,
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          coverLetter: user.coverLetter || "",
          resume: user.resume?.url || null, // optional: pre-fill resume URL (for download or display)
        }));
        setLoading(false);
      } catch (err) {
        console.error(
          "Failed to load profile data",
          err.response?.data || err.message
        );
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const alreadyApplied = appliedJobIds.includes(jobId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (alreadyApplied) {
      alert("You already applied to this job.");
      return;
    }
    try {
      const token =
        typeof window !== "undefined" && window.localStorage
          ? localStorage.getItem("authToken")
          : null;

      const submitData = new FormData();
      submitData.append("name", formData.fullName || "");
      submitData.append("email", formData.email || "");
      submitData.append("phone", formData.phone || "");
      submitData.append("address", formData.address || "");
      submitData.append("coverLetter", formData.coverLetter || "");
      if (formData.resume && formData.resume instanceof File) {
        submitData.append("resume", formData.resume);
      }

      const response = await axios.post(
        `http://localhost:3000/api/v1/application/post/${jobId}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Applied successfully for " + jobTitle);
      onClose();
    } catch (err) {
      console.error(
        "Failed to submit application",
        err.response?.data || err.message
      );
      alert("Failed to submit application");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#023854] to-[#045a7f] text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Apply for Position</h2>
              <p className="text-[#b3d9e8] text-sm">
                {jobTitle || "Software Developer"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#023854] mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          ) : !formData ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">Unable to load profile data.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023854] focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023854] focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023854] focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023854] focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#023854] focus:border-transparent transition-all duration-200 outline-none resize-none"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume
                  </label>
                  {formData.resume && typeof formData.resume === "string" && (
                    <div className="mb-2">
                      <a
                        href={formData.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Current Resume
                      </a>
                    </div>
                  )}
                  <input
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        resume: e.target.files[0],
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Add other fields as needed */}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-[#023854] focus:ring-offset-2 shadow-lg ${
                    alreadyApplied
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#023854] to-[#045a7f] hover:from-[#034a68] hover:to-[#056899] text-white hover:scale-[1.02]"
                  }`}
                  disabled={alreadyApplied}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    {alreadyApplied ? "Already Applied" : "Submit Application"}
                  </div>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyForm;
