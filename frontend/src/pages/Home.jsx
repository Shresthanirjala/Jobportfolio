import React from "react";
import Hero from "../components/Hero";
import TopNiches from "../components/TopNiches";
import HowItWorks from "../components/HowItWorks";
import LandingJobs from "../components/LandingJobs";
// import FindJobs from "../pages/FindJobs"
import CompaniesHiringNow from "../components/CompaniesHiringNow";
import Jobs from "../pages/Jobs"



const Home = () => {
  return (
    <div className="bg-[#f8f5f5]">
      <Hero />
      <HowItWorks />
      {/* <TopNiches /> */}
      {/* <CompaniesHiringNow/> */}
      <LandingJobs/>
      {/* <FindJobs/> */}
      <Jobs/>
    

    </div>
  );
};

export default Home;
