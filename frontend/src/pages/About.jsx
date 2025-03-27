import React from "react";

const About = () => {
  return (
    <div className="mt-18px-4 md:px-40 pt-24 py-40">
      <h1 className="text-[14px] text-[#023552] mt-6">About Handy Hire</h1>

      <div className="flex flex-row gap-5">
        <div className="w-[604px]">
          <img src="/images/about1.png" 
          className="w-[604px] h-[443px]"
          />
        </div>
        <div>
          <h1 className="text-xl text-[#023552] font-bold">WHO WE ARE </h1>
          <h1 className="text-[14px]">Welcome to Handy Hire / Quick Skill, a revolutionary job portal designed to connect skilled workers with the right job opportunities. Whether you’re looking for short-term gigs or long-term employment, we provide a seamless platform to bridge the gap between job seekers and employers.</h1>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default About;
