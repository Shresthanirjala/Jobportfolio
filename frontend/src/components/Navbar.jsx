import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Search,
  Briefcase,
  Bell,
  ChevronDown,
  Building2,
  Shield,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom"; // Use react-router-dom Link

const Navbar = () => {
  const navigate = useNavigate();
  const { users, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleUserLogin = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("user-login", handleUserLogin);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("user-login", handleUserLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`bg-white w-full fixed top-0 left-0 z-50 py-4 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-md"
      }`}
    >
      <div className="w-full flex items-center justify-between px-4 sm:px-10 md:px-16 lg:px-32 max-w-screen-xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="h-10 w-10 bg-[#023854] rounded-lg flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <Link to="/" className="text-2xl font-bold">
            <span className="text-[#023854]">Career</span>
            <span className="text-[#718B68]">Link</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-[15px] mx-auto font-medium">
          <Link
            to="/"
            className="text-[#023854] hover:text-[#718B68] border-b-2 border-transparent hover:border-[#718B68]"
          >
            Home
          </Link>
          <Link
            to="/findjobs"
            className="text-[#023854] hover:text-[#718B68] border-b-2 border-transparent hover:border-[#718B68]"
          >
            Find Jobs
          </Link>
          <Link
            to="/about"
            className="text-[#023854] hover:text-[#718B68] border-b-2 border-transparent hover:border-[#718B68]"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-[#023854] hover:text-[#718B68] border-b-2 border-transparent hover:border-[#718B68]"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          {user ? (
            <>
              <Link
                to="/job/search"
                className="text-[#023854] hover:text-[#718B68]"
              >
                <Search className="h-5 w-5" />
              </Link>
              <Link
                to="/notifications"
                className="text-[#023854] hover:text-[#718B68] relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  2
                </span>
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-[#023854] px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <div className="h-8 w-8 bg-[#023854] rounded-full text-white flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md">
                    <div className="px-4 py-3 border-b bg-[#f0f5f9]">
                      <p className="text-sm font-medium text-[#023854]">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <div className="mt-1 px-2 py-1 bg-[#023854] text-white text-xs rounded-full inline-block">
                        {user.role || "Job Seeker"}
                      </div>
                    </div>
                    <Link
                      to="/myprofile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-[#023854]"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-gray-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-[#023854] text-white px-4 py-2 rounded-md font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#718B68] text-white px-4 py-2 rounded-md font-medium hover:bg-[#5c7254]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#023854]"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg flex flex-col py-4 px-6 absolute w-full">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="py-3 border-b text-[#023854] hover:text-[#718B68]"
          >
            Home
          </Link>
          <Link
            to="/findjobs"
            onClick={() => setIsOpen(false)}
            className="py-3 border-b text-[#023854] hover:text-[#718B68]"
          >
            Find Jobs
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="py-3 border-b text-[#023854] hover:text-[#718B68]"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="py-3 border-b text-[#023854] hover:text-[#718B68]"
          >
            Contact
          </Link>

          {user ? (
            <>
              <div className="flex items-center space-x-2 py-3 border-b">
                <div className="h-8 w-8 bg-[#023854] rounded-full text-white flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-medium text-[#023854]">{user.name}</div>
                  <div className="text-xs px-2 py-1 bg-[#023854] text-white rounded-full inline-block mt-1">
                    {user.role || "Job Seeker"}
                  </div>
                </div>
              </div>
              <Link
                to="/user"
                onClick={() => setIsOpen(false)}
                className="py-3 border-b flex items-center space-x-2 text-[#023854]"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/user/applications"
                onClick={() => setIsOpen(false)}
                className="py-3 border-b flex items-center space-x-2 text-[#023854]"
              >
                <Briefcase className="h-4 w-4" />
                <span>My Applications</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="py-3 text-red-600 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <div className="text-lg font-medium text-[#023854] mt-4 mb-2">
                Sign in as:
              </div>

              <Link
                to="/login/jobseeker"
                onClick={() => setIsOpen(false)}
                className="border border-[#718B68] py-3 px-4 rounded-md mb-2 flex items-center space-x-3"
              >
                <User className="h-5 w-5" />
                <div>
                  <div className="font-medium">Job Seeker</div>
                  <div className="text-xs text-gray-500">
                    Find your dream job
                  </div>
                </div>
              </Link>

              <Link
                to="/login/employer"
                onClick={() => setIsOpen(false)}
                className="border border-[#023854] py-3 px-4 rounded-md mb-2 flex items-center space-x-3"
              >
                <Building2 className="h-5 w-5" />
                <div>
                  <div className="font-medium">Employer</div>
                  <div className="text-xs text-gray-500">
                    Post jobs & find talent
                  </div>
                </div>
              </Link>

              <Link
                to="/login/admin"
                onClick={() => setIsOpen(false)}
                className="border border-gray-400 py-3 px-4 rounded-md mb-2 flex items-center space-x-3"
              >
                <Shield className="h-5 w-5" />
                <div>
                  <div className="font-medium">Admin</div>
                  <div className="text-xs text-gray-500">System management</div>
                </div>
              </Link>

              <div className="mt-2 text-center text-sm text-gray-500">
                Don't have an account?
              </div>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-[#718B68] px-4 py-2 text-white rounded-md text-center font-medium mt-2"
              >
                Register Now
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
