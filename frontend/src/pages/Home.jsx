import React from "react";
import Hero from "../components/Hero";
import TopNiches from "../components/TopNiches";
import HowItWorks from "../components/HowItWorks";
import LandingJobs from "../components/LandingJobs";
import CompaniesHiringNow from "../components/CompaniesHiringNow";

const Home = () => {
  return (
    <div className="bg-[#f8f5f5]">
      <Hero />
      <HowItWorks />
      <TopNiches />
      <CompaniesHiringNow/>
      <LandingJobs/>
    </div>
  );
};

export default Home;
