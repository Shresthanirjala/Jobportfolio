import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  Building2,
  Clock,
  MessageSquare,
} from "lucide-react";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleUserLogin = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) setUser(JSON.parse(updatedUser));
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleScroll = () => setIsScrolled(window.scrollY > 10);

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
    window.location.reload();
  };

  return (
    <nav
      className={`bg-white fixed top-0 left-0 w-full z-50 py-4 shadow-md transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-[#023854] rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <Link to="/admin/dashboard">
            <h1 className="text-2xl font-bold cursor-pointer text-[#023854]">
              Admin<span className="text-[#718B68]">Panel</span>
            </h1>
          </Link>
        </div>

        {/* Right - User Dropdown or Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2  mr-14 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 bg-[#023854] rounded-full text-white flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <span className="text-sm font-medium text-[#023854] truncate max-w-[100px]">
                  {user.name || "Admin"}
                </span>
                <ChevronDown className="h-4 w-4 text-[#023854]" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
                  <div className="px-4 py-3 border-b bg-[#f0f5f9]">
                    <p className="text-sm font-medium text-[#023854]">
                      {user.name || "Admin Name"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <span className="mt-2 inline-block px-2 py-1 text-xs bg-[#023854] text-white rounded-full">
                      {user.role || "Admin"}
                    </span>
                  </div>

                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-[#023854] hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Dashboard</span>
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
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-[#023854]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md mt-2 px-6 py-4">
          {user && (
            <>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-[#023854] rounded-full flex items-center justify-center text-white">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#023854]">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className="text-xs mt-1 inline-block bg-[#023854] text-white px-2 py-1 rounded-full">
                    {user.role || "Admin"}
                  </span>
                </div>
              </div>

              <Link
                to="/admin/dashboard"
                className="block py-2 border-b text-[#023854]"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/messages"
                className="block py-2 border-b text-[#023854]"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>Messages</span>
                  <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                    5
                  </span>
                </div>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left py-2 text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
