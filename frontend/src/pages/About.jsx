import React from "react";
import { FaUsers, FaBriefcase, FaHandshake, FaChartLine } from "react-icons/fa";

const AboutUs = () => {
  return (
    <section className="py-16 bg-white pt-24">
      <div className="px-4 sm:px-10 md:px-16 lg:px-32 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-[#023854]">Career</span>
            <span className="text-[#718B68]">Link</span>
          </h2>
          <div className="h-1 w-24 bg-[#718B68] mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connecting talented professionals with forward-thinking companies
            since 2018. Your career journey matters to us.
          </p>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold text-[#023854] mb-4">
              Our Story
            </h3>
            <p className="text-gray-700 mb-4">
              CareerLink was founded with a simple mission: to transform how job
              seekers and employers connect. We recognized the frustration on
              both sides of the hiring process and set out to create a platform
              that makes meaningful employment connections possible.
            </p>
            <p className="text-gray-700">
              What began as a small startup in Kathmandu has grown into Nepal's
              leading job portal, helping thousands of professionals find their
              dream careers and enabling businesses to build exceptional teams.
              Our commitment to both job seekers and employers remains at the
              heart of everything we do.
            </p>
          </div>
          <div className="bg-[#F5F7F4] p-8 rounded-lg border-l-4 border-[#718B68]">
            <h3 className="text-xl font-bold text-[#023854] mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 mb-6">
              To create opportunity for everyone by connecting the right talent
              with the right employers, empowering careers and driving business
              growth across Nepal and beyond.
            </p>
            <h3 className="text-xl font-bold text-[#023854] mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700">
              To become the most trusted career platform where skills meet
              opportunity, transforming how people build careers and how
              companies build their teams.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-[#023854] text-center mb-12">
            Why Choose CareerLink
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 border-t-4 border-[#718B68]">
              <div className="bg-[#023854] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBriefcase className="text-2xl text-white" />
              </div>
              <h4 className="text-lg font-bold text-[#023854] mb-2">
                Diverse Opportunities
              </h4>
              <p className="text-gray-600">
                Access thousands of job listings across multiple industries and
                experience levels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 border-t-4 border-[#718B68]">
              <div className="bg-[#023854] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-2xl text-white" />
              </div>
              <h4 className="text-lg font-bold text-[#023854] mb-2">
                Talent-First Approach
              </h4>
              <p className="text-gray-600">
                We prioritize skill matching and cultural fit to ensure
                meaningful connections.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 border-t-4 border-[#718B68]">
              <div className="bg-[#023854] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-2xl text-white" />
              </div>
              <h4 className="text-lg font-bold text-[#023854] mb-2">
                Trusted Partnerships
              </h4>
              <p className="text-gray-600">
                Over 500+ companies rely on our platform to build their teams
                with confidence.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition duration-300 border-t-4 border-[#718B68]">
              <div className="bg-[#023854] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-2xl text-white" />
              </div>
              <h4 className="text-lg font-bold text-[#023854] mb-2">
                Career Development
              </h4>
              <p className="text-gray-600">
                Resources and tools to help you grow professionally at every
                stage of your career.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-[#023854] text-white rounded-lg py-10 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-[#718B68] mb-2">
                5,000+
              </div>
              <div className="text-sm uppercase">Active Jobs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#718B68] mb-2">
                10,000+
              </div>
              <div className="text-sm uppercase">Successful Placements</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#718B68] mb-2">
                2,000+
              </div>
              <div className="text-sm uppercase">Partner Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#718B68] mb-2">95%</div>
              <div className="text-sm uppercase">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
