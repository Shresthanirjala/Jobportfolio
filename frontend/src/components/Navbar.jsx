import React, { useState, useEffect, useRef } from "react";
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
// Remove AuthContext related imports
// import { AuthContext } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { userLogout } from "../redux/actions/authActions"; // Import Redux logout action creator
import { Link } from "react-router-dom"; // Use react-router-dom Link

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch hook

  // Use useSelector to get state from the Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [user, setUser] = useState(null); // REMOVE this local user state, use Redux 'user'
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    // REMOVE this: localStorage check should be done once on app load (in App.jsx checkAuthStatus)
    // const storedUser = localStorage.getItem("user");
    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }

    // REMOVE this: Redux handles user login state, no need for custom event listener
    // const handleUserLogin = () => {
    //   const updatedUser = localStorage.getItem("user");
    //   if (updatedUser) {
    //     setUser(JSON.parse(updatedUser));
    //   }
    // };

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
    // REMOVE this: Redux handles user login state
    // window.addEventListener("user-login", handleUserLogin);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      // REMOVE this: Redux handles user login state
      // window.removeEventListener("user-login", handleUserLogin);
    };
  }, []); // Empty dependency array as Redux user state is accessed via useSelector directly

  const handleLogout = () => {
    // Dispatch the Redux logout action
    dispatch(userLogout(navigate)); // Pass navigate to action creator for redirection
    setIsDropdownOpen(false);
    setIsOpen(false);
    // navigate("/"); // Redirection is handled inside userLogout action
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/findjobs?search=${encodeURIComponent(searchValue)}`);
      setShowSearchBar(false);
      setSearchValue("");
    }
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
          {isAuthenticated ? ( // Use isAuthenticated from Redux
            <>
              <button
                onClick={() => setShowSearchBar((prev) => !prev)}
                className="text-[#023854] hover:text-[#718B68]"
                aria-label="Search Jobs"
              >
                <Search className="h-5 w-5" />
              </button>
              {showSearchBar && (
                <div className="absolute top-16 right-32 z-50 bg-white shadow-lg rounded-lg flex items-center px-3 py-2 border border-gray-200">
                  <input
                    type="text"
                    className="border-none outline-none px-2 py-1 text-[#023854] w-56"
                    placeholder="Search jobs, companies..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleSearch}
                    className="ml-2 px-3 py-1 bg-[#718B68] text-white rounded hover:bg-[#5c7254]"
                  >
                    Go
                  </button>
                  <button
                    onClick={() => setShowSearchBar(false)}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    aria-label="Close Search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
              <Link
                to="/myprofile"
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
                    {user?.name?.charAt(0).toUpperCase() || "U"}{" "}
                    {/* Use optional chaining */}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">
                    {user?.name} {/* Use optional chaining */}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md">
                    <div className="px-4 py-3 border-b bg-[#f0f5f9]">
                      <p className="text-sm font-medium text-[#023854]">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      <div className="mt-1 px-2 py-1 bg-[#023854] text-white text-xs rounded-full inline-block">
                        {user?.role || "Job Seeker"}
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

          {isAuthenticated ? ( // Use isAuthenticated from Redux
            <>
              <div className="flex items-center space-x-2 py-3 border-b">
                <div className="h-8 w-8 bg-[#023854] rounded-full text-white flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-medium text-[#023854]">{user?.name}</div>
                  <div className="text-xs px-2 py-1 bg-[#023854] text-white rounded-full inline-block mt-1">
                    {user?.role || "Job Seeker"}
                  </div>
                </div>
              </div>
              <Link
                to="/myprofile" // Corrected link to /myprofile
                onClick={() => setIsOpen(false)}
                className="py-3 border-b flex items-center space-x-2 text-[#023854]"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/my-applications" // Assuming this is the correct route for applications
                onClick={() => setIsOpen(false)}
                className="py-3 border-b flex items-center space-x-2 text-[#023854]"
              >
                <Briefcase className="h-4 w-4" />
                <span>My Applications</span>
              </Link>
              <button
                onClick={handleLogout} // Calls the new Redux-integrated logout
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

              {/* Note: Your login page currently handles role selection.
                  These links would likely point to a general login page or a specific handler if roles were to be pre-selected.
                  For now, redirecting to the main /login page. */}
              <Link
                to="/login" // Redirect to the main login page
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
                to="/login" // Redirect to the main login page
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
                to="/login" // Redirect to the main login page
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
