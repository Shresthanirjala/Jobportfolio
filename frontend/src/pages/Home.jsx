import React, { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import TopNiches from "../components/TopNiches";
import HowItWorks from "../components/HowItWorks";
import LandingJobs from "../components/LandingJobs";
// import FindJobs from "../pages/FindJobs"
import CompaniesHiringNow from "../components/CompaniesHiringNow";
import Jobs from "../pages/Jobs";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/job/getall"
        );
        setJobs(response.data.jobs);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#718B68] border-opacity-50 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-[#013954]">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-lg mb-2">Error loading jobs</div>
          <p className="text-gray-600">{error}</p>
          <button
            className="mt-4 bg-[#718B68] text-white px-4 py-2 rounded hover:bg-opacity-90"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f5f5]">
      <Hero jobs={jobs} />
      <HowItWorks />
      {/* <TopNiches /> */}
      {/* <CompaniesHiringNow/> */}
      <LandingJobs />
      {/* <FindJobs/> */}
      {/* <Jobs /> */}
    </div>
  );
};

export default Home;
