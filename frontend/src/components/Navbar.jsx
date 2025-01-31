import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/images/logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50 py-4">
      <div className="w-full flex items-center justify-between px-4 sm:px-10 md:px-16 lg:px-32 max-w-screen-xl mx-auto">
        {/* Left: Logo + Portfolio Name */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <img src={logo} alt="Logo" className="h-10 w-10" />
          <Link to="/" className="text-2xl font-bold text-[#023854]">
            HandyHire
          </Link>
        </div>

        {/* Centered Menu */}
        <div className="hidden md:flex space-x-10 text-[14px] mx-auto">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/projects" className="hover:text-blue-600">
            Projects
          </Link>
          <Link to="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-600">
            Contact
          </Link>
        </div>

        {/* Right: Login, Register & My Account */}
        <div className="hidden md:flex space-x-4 ml-auto">
          <Link
            to="/login"
            className="bg-[#718B68] text-white px-4 py-2 rounded-md hover:bg-[#718B68]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#718B68] px-4 py-2 text-white rounded-md hover:bg-[#718B68]"
          >
            Register
          </Link>
          {/* My Account Dropdown with Logo */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 text-gray-700 px-4 py-2 font-semibold hover:text-blue-600"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
             
              <span>My Account</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md">
                <Link
                  to="/user"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  User
                </Link>
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Admin
                </Link>
                <Link
                  to="/employer"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Employer
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

     

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg flex flex-col space-y-4 py-4 px-6">
          <Link
            to="/"
            className="hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/projects"
            className="hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/login"
            className="bg-[#718B68] text-white px-4 py-2 rounded-md hover:bg-[#718B68]"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#718B68] px-4 py-2 text-white rounded-md hover:bg-[#718B68]"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
          <Link
            to="/account"
            className="text-gray-700 font-semibold hover:text-blue-600"
            onClick={() => setIsOpen(false)}
          >
            My Account
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
