import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const schema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits")
      .min(1, "Phone number is required"),
    address: z.string().min(3, "Address must be at least 3 characters"),
    role: z.string().min(1, "Role is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    niche1: z.string().optional(),
    niche2: z.string().optional(),
    niche3: z.string().optional(),
    resume: z.any().optional(),
    coverLetter: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [role, setRole] = useState("");
  const [niches] = useState([
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Graphic Design",
    "Marketing",
    "Sales",
  ]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3000/api/v1/user/register", data);
      toast.success("Registration Successful!");
      reset();
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left side - Image */}
          <div className="w-full lg:w-1/2 bg-[#013954]">
            <div className="h-full flex items-center justify-center p-6">
              <img
                src="/images/register.png"
                className="w-full h-auto object-cover rounded-lg shadow-md"
                alt="Register"
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-[#013954]">
                Create Your Account
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Join our platform and connect with opportunities
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="John Doe"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954]"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="your.email@example.com"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954]"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="1234567890"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954]"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  {...register("address")}
                  placeholder="Your full address"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954]"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Two column layout for password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954]"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="••••••••"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954]"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="relative">
                  <select
                    {...register("role")}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954] pr-10"
                  >
                    <option value="">Select your role</option>
                    <option value="Employer">Employer</option>
                    <option value="Job Seeker">Job Seeker</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Job Seeker specific fields */}
              {role === "Job Seeker" && (
                <div className="space-y-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Professional Profile
                  </h3>

                  {/* Niches */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* First Niche */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Niche
                      </label>
                      <div className="relative">
                        <select
                          {...register("niche1")}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954] pr-10"
                        >
                          <option value="">Select</option>
                          {niches.map((niche, index) => (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Second Niche */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Niche
                      </label>
                      <div className="relative">
                        <select
                          {...register("niche2")}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954] pr-10"
                        >
                          <option value="">Select</option>
                          {niches.map((niche, index) => (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Third Niche */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tertiary Niche
                      </label>
                      <div className="relative">
                        <select
                          {...register("niche3")}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954] pr-10"
                        >
                          <option value="">Select</option>
                          {niches.map((niche, index) => (
                            <option key={index} value={niche}>
                              {niche}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="resume"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#013954] hover:text-[#025277] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#013954]"
                          >
                            <span>Upload a file</span>
                            <input
                              id="resume"
                              name="resume"
                              type="file"
                              className="sr-only"
                              {...register("resume")}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC or DOCX up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      {...register("coverLetter")}
                      rows={4}
                      placeholder="Write a brief introduction about yourself and your professional experience..."
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#013954] focus:border-[#013954]"
                    />
                  </div>
                </div>
              )}

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#013954] hover:bg-[#025277] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#013954] transition duration-150 ease-in-out"
                >
                  Create Account
                </button>
              </div>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-[#013954] hover:text-[#025277]"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
