import React, { useEffect, useState } from "react";
import { PiCurrencyDollarSimpleBold } from "react-icons/pi";
import { MdCheck, MdOutlineDescription } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import axios from "axios";

const Jobs = () => {
  // State to store job data
  const [jobs, setJobs] = useState([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage errors
  const [error, setError] = useState(null);

  // Fetch job data from the backend API
  useEffect(() => {
    // Replace with your API URL
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/job/getall"
        );
        console.log(response.data.jobs); // Log to check the jobs array
        setJobs(response.data.jobs); // Set the jobs array to the state
      } catch (err) {
        setError(err.message); // Set error if the request fails
      } finally {
        setLoading(false); // Set loading to false after request completes
      }
    };

    fetchJobs();
  }, []); // Empty array means this effect runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error if there is an issue fetching data
  }

  return (
    <div className="p-16 flex items-center justify-center">
      <div className="flex flex-row gap-[60px]">
        {/* Filters Section */}
        <div className="rounded-2xl bg-white pt-8 pl-12 pr-12 gap-5">
          <h1>All Filters</h1>
          <div className="border w-[200px] mt-5"></div>

          {/* Job Type Section */}
          <div>
            <h1 className="mt-5">Job Type</h1>
            <div className="mt-5">
              <label className="ml-[40px] text-[#4B4B4B]">
                <input
                  type="radio"
                  name="jobType"
                  value="fullTime"
                  className="mr-2"
                />
                Full Time Job
              </label>
            </div>
            <div className="mt-2">
              <label className="ml-[40px] text-[#4B4B4B]">
                <input
                  type="radio"
                  name="jobType"
                  value="partTime"
                  className="mr-2"
                />
                Part Time Job
              </label>
            </div>
            <div className="border w-[200px] mt-5"></div>
          </div>

          {/* Location Section */}
          <div>
            <h1 className="mt-5">Location</h1>
            <div className="mt-5">
              <label className="ml-[40px] text-[#4B4B4B]">
                <input
                  type="radio"
                  name="location"
                  value="kathmandu"
                  className="mr-2"
                />
                Kathmandu, Nepal
              </label>
            </div>
            <div className="mt-2">
              <label className="ml-[40px] text-[#4B4B4B]">
                <input
                  type="radio"
                  name="location"
                  value="pokhara"
                  className="mr-2"
                />
                Pokhara, Nepal
              </label>
            </div>
          </div>
        </div>

        {/* Job Listings Section */}
        <div className="flex flex-col gap-5">
          {jobs.map((job) => {
            const words = job.introduction.split(" ");
            const shortDescription =
              words.slice(0, 14).join(" ") + (words.length > 14 ? "..." : "");

            return (
              <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-3xl shadow-md">
                <div className="flex flex-col gap-2">
                  {/* Job Title & Type */}
                  <div className="flex flex-wrap items-center  gap-7">
                    <h1 className="text-[14px] text-[#4B4B4B]">{job.jobType}</h1>
                    <h1 className="text-[16px] font-semibold text-black">
                      {job.title}
                    </h1>
                  </div>

                  {/* Company Name */}
                  <div className="text-[14px] text-[#023552]">
                    {job.companyName}
                  </div>

                  {/* Salary & Location */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <PiCurrencyDollarSimpleBold className="h-4 w-4" />
                      <h1 className="text-[14px] text-[#4B4B4B]">
                        {job.salary}
                      </h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <CiLocationOn className="h-5 w-5" />
                      <h1 className="text-[14px]">{job.location}</h1>
                    </div>
                  </div>

                  {/* Job Description (Limited to 7 words) */}
                  <div className="flex items-center gap-2">
                    <MdOutlineDescription className="h-5 w-5" />
                    <p className="text-[14px] text-black">{shortDescription}</p>
                  </div>

                  {/* Responsibilities with Bullet Points */}
                  <div className="flex flex-wrap gap-3">
                  <span>Responsibilities:</span>
                    {job.responsibilities.split(",").map((resp, index) => (
                      
                      <h1
                        key={index}
                        className="text-[14px] text-[#4B4B4B] flex items-center gap-1"
                      >
                        
                        <span className="text-lg">•</span> {resp.trim()}
                      </h1>
                    ))}
                  </div>

                  {/* Posted Time */}
                  <div>
                    <h1 className="text-[10px] text-[#4B4B4B]">
                      {job.postedAgo}
                    </h1>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
