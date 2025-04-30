import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#023854] text-white pt-12 pb-6">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-white">Career</span>
              <span className="text-[#718B68]">Link</span>
            </h2>
            <p className="text-gray-300">
              Your trusted partner in finding the perfect job match. We connect
              talented professionals with leading employers across industries.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-[#01263a] rounded-full flex items-center justify-center hover:bg-[#718B68] transition-colors duration-300"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#01263a] rounded-full flex items-center justify-center hover:bg-[#718B68] transition-colors duration-300"
                aria-label="GitHub Profile"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#01263a] rounded-full flex items-center justify-center hover:bg-[#718B68] transition-colors duration-300"
                aria-label="WhatsApp Contact"
              >
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-xl font-bold text-[#718B68] mb-4">
              FOR JOB SEEKERS
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Browse Jobs</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Create Resume</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Job Alerts</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Career Resources</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Salary Guide</a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-xl font-bold text-[#718B68] mb-4">
              FOR EMPLOYERS
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Post a Job</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Search Resumes</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Recruiting Solutions</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Pricing Plans</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Employer Resources</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-[#718B68] mb-4">
              CONTACT US
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#718B68]" />
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-[#718B68]" />
                <span>+977 9807465847</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[#718B68]" />
                <span>contact@careerlink.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#718B68] to-transparent my-6"></div>

        {/* Footer Bottom */}
        <div className="md:flex md:justify-between items-center text-gray-400 text-sm">
          <div>© Copyright 2024, Made by Nirjala Shrestha</div>
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap justify-center md:justify-end gap-4">
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Terms of Service</a>
              </li>
              <li className="hover:text-[#718B68] transition-colors">
                <a href="#">Help Center</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
