import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "/images/logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.reload(); // Reload to reflect changes in the navbar
  };

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-50 py-4">
      <div className="w-full flex items-center justify-between px-4 sm:px-10 md:px-16 lg:px-32 max-w-screen-xl mx-auto">
        {/* Left: Logo + Brand Name */}
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

        {/* Right Side: Show My Account if logged in, otherwise show Login/Register */}
        <div className="hidden md:flex space-x-4 ml-auto">
          {user ? (
            // If user is logged in, show welcome message and My Account dropdown
            <div className="relative">
              <button
                className="flex items-center space-x-2 text-gray-700 px-4 py-2 font-semibold hover:text-blue-600"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>Welcome!!! {user.name}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md">
                  <Link
                    to="/user"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // If user is not logged in, show Login and Register buttons
            <>
              <Link
                to="/login"
                className="bg-[#718B68] text-white px-4 py-2 rounded-md hover:bg-[#5c7254]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#718B68] px-4 py-2 text-white rounded-md hover:bg-[#5c7254]"
              >
                Register
              </Link>
            </>
          )}
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

          {user ? (
            <>
              <Link
                to="/user"
                className="text-gray-700 font-semibold hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-red-600 hover:bg-gray-100 px-4 py-2 rounded-md text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-[#718B68] text-white px-4 py-2 rounded-md hover:bg-[#5c7254]"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#718B68] px-4 py-2 text-white rounded-md hover:bg-[#5c7254]"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
