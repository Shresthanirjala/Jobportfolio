import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmployeProfile = () => {
  const { jobseekerId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `${BASE_URL}/api/v1/user/getuser/${jobseekerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(res.data.user);
      } catch (err) {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [jobseekerId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!profile) return <div className="p-8 text-center">No profile found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">{profile.name}</h2>
      <p className="mb-2">
        <strong>Email:</strong> {profile.email}
      </p>
      <p className="mb-2">
        <strong>Phone:</strong> {profile.phone}
      </p>
      <p className="mb-2">
        <strong>Address:</strong> {profile.address}
      </p>
      <p className="mb-2">
        <strong>Role:</strong> {profile.role}
      </p>
      {profile.coverLetter && (
        <div className="mb-2">
          <strong>Cover Letter:</strong>
          <div className="bg-gray-50 p-3 rounded mt-1">
            {profile.coverLetter}
          </div>
        </div>
      )}
      {profile.resume?.url && (
        <div className="mb-2">
          <strong>Resume:</strong>
          <a
            href={profile.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline ml-2"
          >
            View Resume
          </a>
        </div>
      )}
    </div>
  );
};

export default EmployeProfile;
