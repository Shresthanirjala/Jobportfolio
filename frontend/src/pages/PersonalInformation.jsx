import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";

const PersonalInformation = () => {
  // Initial state for personal information
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    address: "San Francisco, CA",
    coverLetter:
      "I am a dedicated software developer with 5+ years of experience in web development. I specialize in creating robust and user-friendly applications using modern technologies. I'm passionate about solving complex problems and delivering high-quality code that meets business requirements.",
  });

  // State for editing mode
  const [editing, setEditing] = useState(false);

  // Temporary state for editing
  const [editData, setEditData] = useState({});

  // Start editing profile
  const startEditing = () => {
    setEditData({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address,
      coverLetter: profileData.coverLetter,
    });
    setEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing(false);
    setEditData({});
  };

  // Save profile changes
  const saveProfile = () => {
    setProfileData({
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      address: editData.address,
      coverLetter: editData.coverLetter,
    });
    setEditing(false);
    setEditData({});
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Personal Information
      </h1>

      {/* Personal Information Section */}
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
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={editData.phone || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={editData.address || ""}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Cover Letter</label>
              <textarea
                name="coverLetter"
                value={editData.coverLetter || ""}
                onChange={handleInputChange}
                rows="5"
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
