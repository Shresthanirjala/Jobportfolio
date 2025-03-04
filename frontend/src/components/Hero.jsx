import React from "react";

const Hero = () => {
  return (
    <div className="mt-18 flex flex-col gap-[60px] justify-center items-center bg-[#f8f5f5] ]">
      <div className=" w-[850px]">
        <div className=" text-[#013954] text-center p-6  mx-auto md:mt-28 lg:mt-[100px] ">
          <h1 className="text-[40px] font-bold">
            Your Talent, Their Trust – Discover the Best Challenge
          </h1>
          <h3 className="text-[20px] font-bold ">
            Just in few <span className="text-[#DA904D]">Clicks!</span>
          </h3>
        </div>
        <div className="flex justify-center gap-[44px]">
          <div className="rounded-full p-3 max-w-md w-full h-[54px] bg-white shadow-2xl flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent outline-none px-4 text-gray-700"
            />
          </div>
          <button className="rounded-full w-[118px] h-[54px] bg-[#718B68] shadow-2xl text-white flex items-center justify-center text-sm font-semibold hover:bg-[#5d7355] transition duration-300">
            Search Job
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-[18px] font-bold text-[#013954]">
          Trending Searches
        </h3>
        <button></button>
      </div>
    </div>
  );
};

export default Hero;
