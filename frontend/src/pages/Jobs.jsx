import React from "react";
import { CiLocationOn } from "react-icons/ci";

const Jobs = () => {
  return (
    <div className="p-16 flex items-center justify-center">
      <div className="flex flex-row gap-[60px]">
        <div className="rounded-2xl bg-white p-8">
          <div>
            <h1>All Filters</h1>
            <div className="border"></div>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-4 flex flex-col gap-2">
          <div className="flex flex-row gap-5">
            <h1 className="text-[14px] text-[#4B4B4B]">Part Time Job</h1>
            <h1 className="text-[16px] font-semibold text-black">
              Marketing Cordinator
            </h1>
          </div>
          <div className="text-[14px] text-[#023552]">Nirjala Enterprise </div>
          <div className="flex items-center gap-1">
            <CiLocationOn className="h-5 w-5" />
            <h1 className="text-[14px] ">Kathmandu Nepal</h1>
          </div>
          <div className="flex items-center gap-5">
            <h1 className="text-[14px] text-[#4B4B4B] ">Responsibility1</h1>
            <h1 className="text-[14px] text-[#4B4B4B] ">Responsibility1</h1>
            <h1 className="text-[14px] text-[#4B4B4B] ">Responsibility1</h1>
            <h1 className="text-[14px] text-[#4B4B4B] ">Responsibility1</h1>
            <h1 className="text-[14px] text-[#4B4B4B] ">Responsibility1</h1>
          </div>
          <div>
            <h1 className="text-[14px]  text-[#4B4B4B]">5 Days ago</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
