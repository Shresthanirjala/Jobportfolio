import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  role: z.enum(["Employer", "Job Seeker"], { message: "Role is required" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    console.log("Login Successful:", data);
    toast.success("Login Successful!");
  };

  return (
    <div className="px-4 md:px-16 lg:px-32 mt-16 md:mt-32 flex flex-col lg:flex-row gap-8 lg:gap-[35px] items-center lg:items-start">
      {/* Left Image Section */}
      <div className="w-full lg:w-1/2">
        <img
          src="/images/login.jpg"
          className="w-full h-auto object-cover"
          alt="Register"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2">
        <h1 className="text-xs text-[#718B68]">Contact Us</h1>
        <h1 className="text-2xl md:text-3xl text-[#013954] font-bold mt-4 md:mt-8">
          Welcome Back!!
        </h1>
        <h1 className="text-xs text-black mt-2">
          Sign in to continue to your handie hire
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          {/* Full Name */}
          <div className="flex flex-col">
            <label htmlFor="fullName" className="text-xs text-[#023552]">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="text-xs text-[#023552]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label htmlFor="role" className="text-xs text-[#023552]">
              Role
            </label>
            <select
              {...register("role")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            >
              <option value="">Select your role</option>
              <option value="Employer">Employer</option>
              <option value="Job Seeker">Job Seeker</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs">{errors.role.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="password" className="text-xs text-[#023552]">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#013954] text-white p-2 rounded-md mt-4 hover:bg-[#012a3a]"
          >
            Login
          </button>
        </form>

        {/* Already Have an Account */}
        <h1 className="text-xs mt-2">
          Don't have an account?{" "}
          <a href="/register" className="text-[#013954] hover:underline">
            Sign up
          </a>
        </h1>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
