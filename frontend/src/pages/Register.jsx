import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for React Router v6
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

  const navigate = useNavigate(); // Initialize navigate

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <div className="px-4 md:px-16 lg:px-32 mt-16 md:mt-32 flex flex-col lg:flex-row gap-8 lg:gap-[35px] items-center lg:items-start font-sans text-xs">
      <ToastContainer /> {/* ToastContainer for displaying toast messages */}
      <div className="w-full lg:w-1/2">
        <img
          src="/images/register.png"
          className="w-full h-auto object-cover"
          alt="Register"
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h1 className="text-2xl md:text-3xl text-[#013954] font-bold mt-4 md:mt-8">
          Register Account
        </h1>
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              await axios.post(
                "http://localhost:3000/api/v1/user/register",
                data
              );
              toast.success("Registration Successful!"); // Show success toast
              reset(); // Reset the form fields
              // Redirect to login page after successful registration
              setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds to allow the toast to be shown
            } catch (error) {
              toast.error(
                error.response?.data?.message ||
                  "Registration failed. Please try again."
              );
            }
          })}
          className="mt-6 flex flex-col gap-4"
        >
          <label className="text-gray-700">Full Name</label>
          <input
            type="text"
            {...register("name")}
            placeholder="Enter your full name"
            className="border p-2 rounded-md text-xs"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}

          <label className="text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="border p-2 rounded-md text-xs"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}

          <label className="text-gray-700">Phone Number</label>
          <input
            type="tel"
            {...register("phone")}
            placeholder="Enter your phone number"
            className="border p-2 rounded-md text-xs"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}

          <label className="text-gray-700">Address</label>
          <input
            type="text"
            {...register("address")}
            placeholder="Enter your address"
            className="border p-2 rounded-md text-xs"
          />
          {errors.address && (
            <p className="text-red-500 text-xs">{errors.address.message}</p>
          )}

          <label className="text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            className="border p-2 rounded-md text-xs"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}

          <label className="text-gray-700">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm your password"
            className="border p-2 rounded-md text-xs"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}

          <label className="text-gray-700">Role</label>
          <select
            {...register("role")}
            className="border p-2 rounded-md text-xs"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select your role</option>
            <option value="Employer">Employer</option>
            <option value="Job Seeker">Job Seeker</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs">{errors.role.message}</p>
          )}

          {role === "Job Seeker" && (
            <>
              <label className="text-gray-700">First Niche</label>
              <select
                {...register("niche1")}
                className="border p-2 rounded-md text-xs"
              >
                <option value="">Select your first niche</option>
                {niches.map((niche, index) => (
                  <option key={index} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>

              <label className="text-gray-700">Second Niche</label>
              <select
                {...register("niche2")}
                className="border p-2 rounded-md text-xs"
              >
                <option value="">Select your second niche</option>
                {niches.map((niche, index) => (
                  <option key={index} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>

              <label className="text-gray-700">Third Niche</label>
              <select
                {...register("niche3")}
                className="border p-2 rounded-md text-xs"
              >
                <option value="">Select your third niche</option>
                {niches.map((niche, index) => (
                  <option key={index} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>

              <label className="text-gray-700">Resume</label>
              <input
                type="file"
                {...register("resume")}
                className="border p-2 rounded-md text-xs"
              />
              <label className="text-gray-700">Cover Letter</label>
              <textarea
                {...register("coverLetter")}
                placeholder="Write your cover letter here..."
                className="border p-2 rounded-md text-xs h-32"
              />
            </>
          )}

          <button
            type="submit"
            className="bg-[#013954] text-white p-2 rounded-md mt-4 text-xs"
          >
            Register
          </button>
        </form>
        <h1 className="text-xs mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-[#013954] hover:underline">
            Login
          </a>
        </h1>
      </div>
    </div>
  );
};

export default Register;
