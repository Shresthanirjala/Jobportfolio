import React, { useState, useEffect } from "react"; // Removed useContext
import { useSelector } from "react-redux"; // Import Redux useSelector hook
import { User, Mail, Phone, MapPin, Edit, Save, X, Plus } from "lucide-react";
import axios from "axios";
// Removed AuthContext import
// import { AuthContext } => No need for this anymore
import { BASE_URL } from "../config/config";

const jobNiches = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Graphic Design",
  "Marketing",
  "Sales",
  "UI/UX Design",
  "AI/ML",
  "Blockchain",
  "Cybersecurity",
  "Finance",
  "HR",
  "Education",
  "Writing",
  "Customer Service",
  "Project Management",
  "Legal",
  "DevOps",
  "Software Testing",
  "Software Developer",
];

const PersonalInformation = () => {
  // Use useSelector to get user and authLoading state from the Redux store
  const { user, authLoading } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    // If authLoading is true, wait for authentication status to be determined
    if (authLoading) return;

    // Fetch user profile only if authenticated and user object with token exists
    if (user && user.token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${BASE_URL}api/v1/user/getuser`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setProfileData(res.data.user);
          setError("");
        } catch (err) {
          setProfileData(null);
          setError("Failed to fetch user profile. Please log in again."); // More user-friendly error
          console.error("Failed to fetch user:", err);
          // Optionally, redirect to login if token is invalid or expired
          // navigate('/login'); // You might want to dispatch a logout action here too
        }
      };
      fetchUser();
    } else {
      // If not authenticated, clear profile data and set an error
      setProfileData(null);
      setError("Please log in to view your profile.");
    }
  }, [user, authLoading]); // Dependencies: re-run when user or authLoading changes

  const startEditing = () => {
    // Ensure profileData exists before attempting to set editData
    if (!profileData) {
      setError("No profile data to edit.");
      return;
    }
    setEditData({
      name: profileData.name || "",
      email: profileData.email || "",
      phone: profileData.phone || "",
      address: profileData.address || "",
      coverLetter: profileData.coverLetter || "",
      resume: profileData.resume || null, // Keep resume as it is initially, handle file upload separately
      niches: profileData.niches
        ? [
            profileData.niches.firstNiche || "",
            profileData.niches.secondNiche || "",
            profileData.niches.thirdNiche || "",
            profileData.niches.fourthNiche || "",
            profileData.niches.fifthNiche || "",
            profileData.niches.sixthNiche || "",
            profileData.niches.seventhNiche || "",
          ].filter(Boolean)
        : [],
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditData({}); // Clear edit data on cancel
    setError("");
  };

  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNicheChange = (index, value) => {
    const newNiches = [...(editData.niches || [])];
    newNiches[index] = value;
    setEditData({ ...editData, niches: newNiches });
  };

  const addNiche = () => {
    if (!editData.niches) {
      setEditData({ ...editData, niches: [""] });
    } else if (editData.niches.length < 7) {
      setEditData({ ...editData, niches: [...editData.niches, ""] });
    }
  };

  const removeNiche = (index) => {
    const newNiches = editData.niches.filter((_, i) => i !== index);
    setEditData({ ...editData, niches: newNiches });
  };

  const saveProfile = async () => {
    if (!user || !user.token) {
      setError("Authentication token missing. Please log in.");
      return;
    }

    try {
      let formData = new FormData();
      formData.append("name", editData.name);
      formData.append("email", editData.email);
      formData.append("phone", editData.phone);
      formData.append("address", editData.address);
      formData.append("coverLetter", editData.coverLetter);

      // Append up to 7 niche fields expected by backend
      const niches = editData.niches || [];
      for (let i = 0; i < 7; i++) {
        formData.append(
          [
            "firstNiche",
            "secondNiche",
            "thirdNiche",
            "fourthNiche",
            "fifthNiche",
            "sixthNiche",
            "seventhNiche",
          ][i],
          niches[i] || ""
        );
      }

      // Append resume if a new file object (type is 'object' for File objects)
      if (
        editData.resume &&
        typeof editData.resume === "object" &&
        editData.resume instanceof File
      ) {
        formData.append("resume", editData.resume);
      } else if (profileData.resume && typeof profileData.resume === "object") {
        // If no new resume, but a current one exists, you might send its URL/ID
        // or let the backend handle keeping the old one if no new file is sent.
        // For now, assuming backend keeps existing if no 'resume' field is appended.
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data", // Important for FormData
        },
      };

      const res = await axios.put(
        `${BASE_URL}api/v1/user/update/profile`,
        formData,
        config
      );

      setProfileData(res.data.user); // Update local state with new data
      setEditing(false);
      setEditData({});
      setError("");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  // Render loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="text-center mt-8 text-gray-600">
        Loading authentication...
      </div>
    );
  }

  // Render message if user is not logged in
  if (!user) {
    return (
      <div className="text-red-600 text-center mt-8">
        Please log in to view your profile.
      </div>
    );
  }

  // Render error message if there's an error fetching profile data
  if (error && !editing) {
    // Show error only if not editing and there was an error fetching
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  // Render loading state while profile data is being fetched (after auth is confirmed)
  if (!profileData && !error) {
    // Only show if not editing and no error to show
    return (
      <div className="text-center mt-8 text-gray-600">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Personal Information
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Personal Information
          </h2>
          {!editing ? (
            <button
              onClick={startEditing}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveProfile}
                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="flex items-center text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {!editing ? (
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
                {profileData.coverLetter || "N/A"}
              </p>
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Resume</label>
              {profileData.resume && profileData.resume.url ? (
                <div className="flex items-center gap-3">
                  <a
                    href={profileData.resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Resume
                  </a>
                  <span className="text-gray-500 text-sm">
                    {profileData.resume.name || "resume.pdf"}
                  </span>
                </div>
              ) : (
                <span className="text-gray-400 text-sm">
                  No resume uploaded.
                </span>
              )}
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Niches</label>
              <div className="flex flex-wrap gap-2">
                {profileData.niches ? (
                  [
                    profileData.niches.firstNiche,
                    profileData.niches.secondNiche,
                    profileData.niches.thirdNiche,
                    profileData.niches.fourthNiche,
                    profileData.niches.fifthNiche,
                    profileData.niches.sixthNiche,
                    profileData.niches.seventhNiche,
                  ]
                    .filter(Boolean)
                    .map((niche, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 text-xs rounded-full ${
                          idx % 3 === 0
                            ? "bg-blue-100 text-blue-800"
                            : idx % 3 === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {niche}
                      </span>
                    ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    No niches defined.
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Name, Email, Phone, Address Inputs */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={editData.name || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={editData.phone || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={editData.address || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cover Letter */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={editData.coverLetter || ""}
                onChange={handleInputChange}
                rows="5"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Resume upload */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Resume</label>

              {/* Display current resume if available and no new file is selected */}
              {profileData.resume &&
                profileData.resume.url &&
                !(editData.resume && editData.resume instanceof File) && (
                  <div className="mb-2">
                    <a
                      href={profileData.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Current Resume
                    </a>
                  </div>
                )}

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setEditData({
                      ...editData,
                      resume: e.target.files[0], // Store File object
                    });
                  } else {
                    // If file input is cleared, reset resume in editData to null
                    setEditData({
                      ...editData,
                      resume: null,
                    });
                  }
                }}
                className="mb-2 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
              />

              {/* Display name of selected new file or "No file selected" */}
              <span className="text-gray-500 text-sm">
                {editData.resume && editData.resume instanceof File
                  ? editData.resume.name
                  : "No new file selected"}
              </span>

              {/* Option to clear selected new file */}
              {editData.resume && editData.resume instanceof File && (
                <button
                  onClick={() => setEditData({ ...editData, resume: null })}
                  className="text-red-500 text-sm hover:underline mt-1 w-fit"
                  type="button"
                >
                  Remove selected file
                </button>
              )}
            </div>

            {/* Dynamic Niches */}
            <div className="md:col-span-2 flex flex-col space-y-4">
              <label className="text-sm text-gray-500 mb-1">Niches</label>

              {/* Render existing/editing niches */}
              {editData.niches && editData.niches.length > 0 ? (
                editData.niches.map((niche, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <select
                      name={`niche-${index}`}
                      value={niche}
                      onChange={(e) => handleNicheChange(index, e.target.value)}
                      className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                    >
                      <option value="" disabled>
                        Select Niche
                      </option>
                      {jobNiches.map((jobNiche) => (
                        <option key={jobNiche} value={jobNiche}>
                          {jobNiche}
                        </option>
                      ))}
                    </select>
                    {/* Add remove button for each niche, up to 7, if you want */}
                    {index > 0 && ( // Allow removing if more than one niche, or adjust logic
                      <button
                        type="button"
                        onClick={() => removeNiche(index)}
                        className="text-red-500 hover:underline text-sm p-1"
                        aria-label={`Remove niche ${index + 1}`}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No niches added.</p>
              )}

              {/* Add Niche Button */}
              {(!editData.niches || editData.niches.length < 7) && (
                <button
                  type="button"
                  onClick={addNiche}
                  className="text-blue-600 hover:underline mt-2 self-start flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Niche
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
