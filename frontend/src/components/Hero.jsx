import React from "react";
import { FaSearch } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";

const Hero = () => {
  const trendingSearches = [
    "UiUx Designer",
    "Developers",
    "App developers",
    "Backend Developer",
    "QA Engineer",
  ];

  return (
    <div className="mt-18 flex flex-col gap-10 justify-center items-center bg-[#f8f5f5] px-4 md:px-10 pt-24 py-[100px]">
      <div className="w-full max-w-[850px]">
        {/* Header Section */}
        <div className="text-[#013954] text-center p-6">
          <h1 className="text-[28px] md:text-[40px] font-bold leading-tight">
            Your Talent, Their Trust – Discover the Best Challenge
          </h1>
          <h3 className="text-[16px] md:text-[20px] font-bold mt-2">
            Just in few <span className="text-[#DA904D]">Clicks!</span>
          </h3>
        </div>

        {/* Search Bar Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Search Input Container */}
          <div className="rounded-full p-3 w-full md:max-w-md bg-white shadow-2xl flex items-center gap-4">
            {/* Search Input */}
            <div className="flex items-center gap-2 w-full">
              <FaSearch className="text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search for job"
                className="bg-transparent outline-none text-gray-700 w-full"
              />
            </div>

            {/* Divider */}
            <div className="w-[1px] bg-gray-300 h-6"></div>

            {/* Location Input */}
            <div className="flex items-center gap-2 w-full">
              <IoLocationOutline className="text-gray-500" size={22} />
              <input
                type="text"
                placeholder="Location"
                className="bg-transparent outline-none text-gray-700 w-full"
              />
            </div>
          </div>

          {/* Search Button */}
          <button className="rounded-full w-full md:w-[140px] h-[54px] bg-[#718B68] shadow-2xl text-white flex items-center justify-center text-sm font-semibold hover:bg-[#5d7355] transition duration-300">
            Search Job
          </button>
        </div>
      </div>

      {/* Trending Searches */}
      <h3 className="text-[16px] md:text-[18px] font-bold text-[#013954]">
        Trending Searches
      </h3>
      <div className="flex flex-wrap justify-center gap-3 md:gap-5">
        {trendingSearches.map((search, index) => (
          <button
            key={index}
            className="px-4 py-2 border border-[#CECECE] rounded-full text-sm md:text-base"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
