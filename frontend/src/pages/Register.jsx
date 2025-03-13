import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = z
  .object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits")
      .min(1, "Phone number is required"),
    address: z.string().min(10, "Address must be at least 10 characters"),
    niche1: z.string().min(1, "First niche is required"),
    niche2: z.string().optional(),
    niche3: z.string().optional(),
    role: z.string().min(1, "Role is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    console.log("Registration Successful:", data);
    toast.success("Registration Successful!");
  };

  return (
    <div className="px-4 md:px-16 lg:px-32 mt-16 md:mt-32 flex flex-col lg:flex-row gap-8 lg:gap-[35px] items-center lg:items-start">
      <ToastContainer />
      {/* Left Image Section */}
      <div className="w-full lg:w-1/2">
        <img
          src="/images/register.png"
          className="w-full h-auto object-cover"
          alt="Register"
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2">
        <h1 className="text-xs text-[#718B68]">Contact Us</h1>
        <h1 className="text-2xl md:text-3xl text-[#013954] font-bold mt-4 md:mt-8">
          Register Account
        </h1>
        <h1 className="text-xs text-black mt-2">Get Your Free Handy Hire</h1>

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

          {/* Phone Number */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-xs text-[#023552]">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              {...register("phone")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className="text-xs text-[#023552]">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter your address"
              {...register("address")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          {/* First Niche */}
          <div className="flex flex-col">
            <label htmlFor="niche1" className="text-xs text-[#023552]">
              First Niche
            </label>
            <input
              type="text"
              placeholder="Enter your first niche"
              {...register("niche1")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.niche1 && (
              <p className="text-red-500 text-xs">{errors.niche1.message}</p>
            )}
          </div>
           {/* First Niche */}
           <div className="flex flex-col">
            <label htmlFor="niche2" className="text-xs text-[#023552]">
              Second Niche
            </label>
            <input
              type="text"
              placeholder="Enter your first niche"
              {...register("niche3")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.niche1 && (
              <p className="text-red-500 text-xs">{errors.niche2.message}</p>
            )}
          </div>
           {/* First Niche */}
           <div className="flex flex-col">
            <label htmlFor="niche3" className="text-xs text-[#023552]">
              Third Niche
            </label>
            <input
              type="text"
              placeholder="Enter your first niche"
              {...register("niche3")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.niche1 && (
              <p className="text-red-500 text-xs">{errors.niche3.message}</p>
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

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-xs text-[#023552]">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#013954] text-white p-2 rounded-md mt-4 hover:bg-[#012a3a]"
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
