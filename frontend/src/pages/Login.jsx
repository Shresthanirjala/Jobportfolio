import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { loginUser } from "../redux/actions/authActions"; // Import Redux login action creator

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff, Mail, Lock, Briefcase } from "lucide-react"; // Removed 'User' as it's not used in this component

// Zod schema for form validation
const schema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  role: z.enum(["Employer", "Job Seeker", "Admin"], {
    message: "Role is required",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch(); // Initialize useDispatch hook to dispatch actions
  const navigate = useNavigate(); // Initialize useNavigate hook for navigation

  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  // Local state for password visibility (not managed by Redux)
  const [showPassword, setShowPassword] = useState(false);

  // useEffect to handle redirection if already authenticated or after successful login
  useEffect(() => {
    if (isAuthenticated && user) {
      if (window.location.pathname === "/login") {
        const userId = user._id; // Assuming user object has _id for Employer dashboard

        if (user.role === "Job Seeker") {
          navigate("/");
        } else if (user.role === "Employer") {
          navigate(`/employer/dashboard/${userId}`);
        } else if (user.role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/"); // Fallback for unknown roles
        }
      }
    }
  }, [isAuthenticated, user, navigate]); // Dependencies for useEffect

  // Function to handle form submission
  const onSubmit = (data) => {
    // Dispatch the loginUser async action.
    // The action creator handles the API call, setting loading states,
    // dispatching success/failure, storing to localStorage, and showing toasts.
    // It also takes 'navigate' as an argument to handle redirection within the action.
    dispatch(loginUser(data, navigate));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-5xl flex flex-col lg:flex-row">
        {/* Left Side - Branding (No changes from your original code) */}
        <div className="w-full lg:w-1/2 relative bg-gradient-to-br from-[#023854] to-[#024E76] text-white p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[#023854] opacity-20 pattern-overlay"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold flex items-center">
              <span className="bg-white text-[#023854] p-2 rounded-lg mr-2"></span>
              CreatorLink
            </h2>
            <p className="text-blue-100 mt-2">
              Connecting talent with opportunity
            </p>
          </div>

          <div className="relative z-10 mt-16">
            <h1 className="text-4xl font-bold leading-tight">Welcome Back!</h1>
            <p className="text-blue-100 mt-4 text-lg leading-relaxed">
              Sign in to access your account and continue your professional
              journey with HandieHire.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12   backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Streamlined Access</h3>
                  <p className="text-blue-100 text-sm">
                    Quick access to your personalized dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#023854]/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Enhanced Security</h3>
                  <p className="text-blue-100 text-sm">
                    Your data is fully protected with enterprise-grade security
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-sm text-blue-200 mt-12">
            © 2025 HandieHire. All rights reserved.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex items-center bg-gray-50">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#023854]">Sign In</h2>
              <p className="text-gray-600 mt-2">
                Please enter your details to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#023854]">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023854] focus:border-transparent transition"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">
                    {errors.email.message?.toString()}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#023854]">
                    <Briefcase size={18} />
                  </div>
                  <select
                    {...register("role")}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023854] focus:border-transparent transition appearance-none bg-transparent"
                  >
                    <option value="">Select your role</option>
                    <option value="Employer">Employer</option>
                    <option value="Job Seeker">Job Seeker</option>{" "}
                    <option value="Admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600">
                    {errors.role.message?.toString()}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-[#023854] hover:text-[#718B68] transition"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#023854]">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#023854] focus:border-transparent transition"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-[#023854]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message?.toString()}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#023854] hover:bg-[#023854]/90 text-white py-3 rounded-lg transition duration-300 flex items-center justify-center shadow-md mt-6"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {loading ? "Signing In..." : "Sign In"}{" "}
                {/* Button text changes based on 'loading' state */}
              </button>
            </form>

            {/* Social Login (No changes from your original code) */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition"
                >
                  <svg
                    className="w-5 h-5 text-[#023854]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.188-2.701-6.735-2.701-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10-7.584 10-11.177 0-0.75-0.063-1.475-0.19-2.189h-9.81z" />
                  </svg>
                  <span className="ml-2 text-gray-700">Google</span>
                </button>

                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition"
                >
                  <svg
                    className="w-5 h-5 text-[#023854]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                  <span className="ml-2 text-gray-700">Facebook</span>
                </button>
              </div> */}
            </div>

            {/* Sign Up Link (No changes from your original code) */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-[#023854] hover:text-[#718B68] font-medium transition"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
