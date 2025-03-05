import React from "react";

const HowItWorks = () => {
  return (
    <section className="bg-[#f8f5f5]">
      {/* Text Section */}
      <div className="text-center py-10 px-6">
        <h2 className="text-[#718B68] text-xs">How it Works</h2>
        <h1 className="text-[28px] md:text-[40px] font-bold leading-tight text-[#013954]">
          Simple steps to get
        </h1>
        <h1 className="text-[28px] md:text-[40px] font-bold leading-tight text-[#013954]">
          your next job
        </h1>
      </div>

      {/* Background Image Section */}
      <div className="w-full max-w-[1450px] h-[400px] mx-auto relative bg-no-repeat bg-cover md:block">
        {/* The background image will be hidden on mobile */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/handyhirelanding.png')] md:block hidden"></div>

        {/* Card Section */}
        <div className="flex justify-center items-center w-full h-full absolute top-0 left-0 flex-wrap md:flex-nowrap">
          {/* Card 1 */}
          <div className="bg-[#BFD4CDCC] w-[300px] h-[300px] rounded-2xl mx-2 mb-4 md:mb-0">
            <div className="flex justify-center items-center h-full flex-col gap-y-[40px]">
              <img src="/images/register.svg" alt="Register Icon" />
              <div className="mx-4 text-center">
                <h1 className="text-[#292929] font-semibold mb-3 text-[20px]">
                  Register Your Account
                </h1>
                <h2 className="text-[16px] text-[#000000]">
                  Capitalize on low hanging fruit to identify added Override the
                  digital.
                </h2>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#BFD4CDCC] w-[300px] h-[300px] rounded-2xl mx-2 mb-4 md:mb-0">
            <div className="flex justify-center items-center h-full flex-col gap-y-[40px]">
              <img src="/images/resume.svg" alt="Resume Icon" />
              <div className="mx-4 text-center">
                <h1 className="text-[#292929] font-semibold mb-3 text-[20px]">
                  Update Resume
                </h1>
                <h2 className="text-[16px] text-[#000000]">
                  Capitalize on low hanging fruit to identify added Override the
                  digital.
                </h2>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#BFD4CDCC] w-[300px] h-[300px] rounded-2xl mx-2 mb-4 md:mb-0">
            <div className="flex justify-center items-center h-full flex-col gap-y-[40px]">
              <img src="/images/job.svg" alt="Job Icon" />
              <div className="mx-4 text-center">
                <h1 className="text-[#292929] font-semibold mb-3 text-[20px]">
                  Apply For New Jobs
                </h1>
                <h2 className="text-[16px] text-[#000000]">
                  Capitalize on low hanging fruit to identify added Override the
                  digital.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
