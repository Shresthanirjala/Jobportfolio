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
    niche1: z.string().min(1, "Niche is required"),
    niche2: z.string().min(1, "Niche is required"),
    niche3: z.string().min(1, "Niche is required"),
    resume: z.any().refine((file) => !!file, {
      message: "Resume is required",
    }),
    coverLetter: z.string().min(1, "Cover letter is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [role, setRole] = useState("");
  const [fileName, setFileName] = useState("");
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

  // Custom input component for consistency
  const FormInput = ({ label, type, placeholder, name, error }) => (
    <div className="mb-4">
      <label className="block text-[#013954] font-medium mb-2 text-sm">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#013954] focus:border-transparent text-sm"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );

  // Custom select component
  const FormSelect = ({ label, name, options, placeholder, error }) => (
    <div className="mb-4">
      <label className="block text-[#013954] font-medium mb-2 text-sm">
        {label}
      </label>
      <select
        {...register(name)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#013954] focus:border-transparent text-sm"
        onChange={name === "role" ? (e) => setRole(e.target.value) : undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option
            key={index}
            value={typeof option === "string" ? option : option.value}
          >
            {typeof option === "string" ? option : option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );

  const onSubmit = async (data) => {
    try {
      // Create a FormData object to properly handle file uploads
      const formData = new FormData();

      // Add all text fields
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("role", data.role);
      formData.append("password", data.password);

      // Add optional fields only if they exist
      if (data.niche1) formData.append("niche1", data.niche1);
      if (data.niche2) formData.append("niche2", data.niche2);
      if (data.niche3) formData.append("niche3", data.niche3);
      if (data.coverLetter) formData.append("coverLetter", data.coverLetter);

      // Add resume file if it exists
      if (data.resume && data.resume[0]) {
        formData.append("resume", data.resume[0]);
        console.log("Resume file added:", data.resume[0].name); // Debug log
      }

      // Make the API request with FormData
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      console.log("Registration response:", response.data); // Debug log
      toast.success("Registration Successful!");
      reset();
      setFileName(""); // Reset file name state
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ToastContainer />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 bg-[#013954] flex items-center justify-center p-6">
              <div className="text-center">
                <img
                  src="/images/register.png"
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                  alt="Register"
                />
                <div className="mt-8 text-white">
                  <h2 className="text-2xl font-bold">Join Our Community</h2>
                  <p className="mt-4 opacity-80">
                    Connect with employers and find your dream job or hire the
                    best talent.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2 p-8">
              <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-[#013954] mb-6">
                  Create Your Account
                </h1>
                <p className="text-gray-600 mb-8">
                  Fill in your details to get started with our platform
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-2"
                  encType="multipart/form-data"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <FormInput
                      label="Full Name"
                      type="text"
                      placeholder="Enter your full name"
                      name="name"
                      error={errors.name}
                    />

                    <FormInput
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      error={errors.email}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your phone number"
                        name="phone"
                        error={errors.phone}
                      />

                      <FormSelect
                        label="Role"
                        name="role"
                        options={[
                          { value: "Employer", label: "Employer" },
                          { value: "Job Seeker", label: "Job Seeker" },
                        ]}
                        placeholder="Select your role"
                        error={errors.role}
                      />
                    </div>

                    <FormInput
                      label="Address"
                      type="text"
                      placeholder="Enter your address"
                      name="address"
                      error={errors.address}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        error={errors.password}
                      />

                      <FormInput
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        error={errors.confirmPassword}
                      />
                    </div>

                    {role === "Job Seeker" && (
                      <div className="space-y-4 border-t border-gray-200 pt-4 mt-2">
                        <h3 className="text-lg font-medium text-[#013954]">
                          Professional Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormSelect
                            label="Primary Niche"
                            name="niche1"
                            options={niches}
                            placeholder="Select primary niche"
                            error={errors.niche1}
                          />

                          <FormSelect
                            label="Secondary Niche"
                            name="niche2"
                            options={niches}
                            placeholder="Select secondary niche"
                            error={errors.niche2}
                          />

                          <FormSelect
                            label="Third Niche"
                            name="niche3"
                            options={niches}
                            placeholder="Select third niche"
                            error={errors.niche3}
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#013954] font-medium mb-2 text-sm">
                            Resume
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col border-2 border-dashed border-gray-300 rounded-lg w-full h-24 p-2 group text-center cursor-pointer hover:bg-gray-50">
                              <div className="h-full w-full text-center flex flex-col items-center justify-center">
                                {fileName ? (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6 text-green-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    <p className="text-sm text-green-500 mt-1 font-medium">
                                      {fileName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Click to change file
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-8 h-8 text-gray-400 group-hover:text-[#013954]"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                      />
                                    </svg>
                                    <p className="text-sm text-gray-500 group-hover:text-[#013954]">
                                      Upload your resume
                                    </p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                {...register("resume")}
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setFileName(e.target.files[0].name);
                                  } else {
                                    setFileName("");
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-[#013954] font-medium mb-2 text-sm">
                            Cover Letter
                          </label>
                          <textarea
                            {...register("coverLetter")}
                            placeholder="Write your cover letter here..."
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#013954] focus:border-transparent text-sm h-32"
                          />
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-[#013954] text-white py-3 px-6 rounded-lg hover:bg-[#014968] transition-all duration-200 font-medium text-sm shadow-md"
                      >
                        Create Account
                      </button>
                    </div>

                    <div className="text-center mt-4 text-sm">
                      Already have an account?{" "}
                      <a
                        href="/login"
                        className="text-[#013954] font-medium hover:underline"
                      >
                        Login
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
