import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LandingJobs = () => {
  // Sample job data (Replace this with real data from your API)
  const jobs = [
    { id: 1, title: "Software Engineer", numbers: "8" },
    { id: 2, title: "Product Manager", numbers: "8" },
    { id: 3, title: "Data Analyst", numbers: "8" },
    { id: 4, title: "UX Designer", numbers: "8" },
    { id: 5, title: "QA Engineer", numbers: "8" },
    { id: 6, title: "DevOps Engineer", numbers: "8" },
    { id: 7, title: "Backend Developer", numbers: "8" },
    { id: 8, title: "Frontend Developer", numbers: "8" },
    // Additional jobs for slider demonstration
    { id: 9, title: "System Administrator", numbers: "8" },
    { id: 10, title: "Security Specialist", numbers: "8" },
  ];

  // Slider settings: we want 8 items per slide, arranged as 4 rows and 2 columns.
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    rows: 4, // 4 rows per slide
    slidesPerRow: 2, // 2 columns per row (4 x 2 = 8 items)
    responsive: [
      {
        breakpoint: 1024, // Medium screens (tablets)
        settings: {
          rows: 4,
          slidesPerRow: 1, // On medium screens, show 1 column per row
        },
      },
      {
        breakpoint: 600, // Small screens (phones)
        settings: {
          rows: 4,
          slidesPerRow: 1, // On small screens, show 1 column per row
        },
      },
    ],
  };

  // Reusable job card with the same style as before
  const JobCard = ({ job }) => (
    <div className="bg-gray-100 p-4 rounded-lg flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm">{job.title}</h2>
          <p className="text-sm text-gray-600">
            {job.numbers}+ <span className="ml-2">jobs</span>
          </p>
        </div>
      </div>
      {job.resume && (
        <div className="mt-2">
          <a
            href={job.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
          >
            View Resume
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-[100px]">
      <div className="bg-[#BFD4CD] flex flex-row justify-center items-center py-10">
        {/* Left Section */}
        <div className="px-12 hidden md:block">
          {" "}
          {/* Hide on mobile screens */}
          <img src="/images/jobs.png" alt="Jobs" />
          <h1 className="text-[#023552] font-bold mt-3 text-2xl text-center">
            Discover Jobs Across Popular Roles
          </h1>
          <h2 className="text-sm text-center mt-3">
            Select a role and we'll show you relevant jobs for it!
          </h2>
        </div>

        {/* Right Section */}
        <div className="bg-white shadow-md border border-slate-200 w-full max-w-[500px] rounded-2xl p-6 mx-4 sm:mx-0">
          <h1 className="text-2xl font-bold text-center text-[#023552] mb-6">
            Long-Term Jobs
          </h1>

          {jobs.length <= 8 ? (
            // Static grid: use 2 columns (grid-cols-2) to display 8 jobs (4 in each column)
            <div className="grid grid-cols-2 gap-4">
              {jobs.slice(0, 8).map((job, index) => (
                <JobCard key={`${job.id}-${index}`} job={job} />
              ))}
            </div>
          ) : (
            // Slider for more than 8 jobs, with each slide showing 8 jobs arranged as 4 rows and 2 columns
            <Slider {...sliderSettings}>
              {jobs.map((job, index) => (
                <div key={`${job.id}-${index}`} className="p-2">
                  <JobCard job={job} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingJobs;
