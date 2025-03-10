import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
    niche2: z.string().min(1, "Second niche is required"),
    niche3: z.string().min(1, "Third niche is required"),
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
  };

  return (
    <div className="px-32 mt-32 flex gap-[35px]">
      <div className="flex-1">
        <img
          src="/images/register.png"
          className="w-full h-full object-cover"
          alt="Register"
        />
      </div>
      <div className="flex-1">
        <h1 className="text-xs text-[#718B68]">Contact Us</h1>
        <h1 className="text-3xl text-[#013954] font-bold mt-8">
          Register Account
        </h1>
        <h1 className="text-xs text-black font-semibold mt-2">
          Get Your Free Handy Hire
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <div className="flex flex-col">
            <label htmlFor="fullName" className="font-semibold">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              {...register("fullName")}
              className="border p-2 rounded-md w-full"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs">{errors.fullName.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
              className="border p-2 rounded-md w-full"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="font-semibold">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              {...register("phone")}
              className="border p-2 rounded-md w-full"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="font-semibold">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter your address"
              {...register("address")}
              className="border p-2 rounded-md w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="niche1" className="font-semibold">
              First Niche
            </label>
            <input
              type="text"
              placeholder="Enter your first niche"
              {...register("niche1")}
              className="border p-2 rounded-md w-full"
            />
            {errors.niche1 && (
              <p className="text-red-500 text-xs">{errors.niche1.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="niche2" className="">
              Second Niche
            </label>
            <input
              type="text"
              placeholder="Enter your second niche"
              {...register("niche2")}
              className="border p-2 rounded-md w-full"
            />
            {errors.niche2 && (
              <p className="text-red-500 text-xs">{errors.niche2.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="niche3" className="font-semibold">
              Third Niche
            </label>
            <input
              type="text"
              placeholder="Enter your third niche"
              {...register("niche3")}
              className="border p-2 rounded-md w-full"
            />
            {errors.niche3 && (
              <p className="text-red-500 text-xs">{errors.niche3.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="role" className="font-semibold">
              Role
            </label>
            <input
              type="text"
              placeholder="Enter your role"
              {...register("role")}
              className="border p-2 rounded-md w-full"
            />
            {errors.role && (
              <p className="text-red-500 text-xs">{errors.role.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className="border p-2 rounded-md w-full"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className="border p-2 rounded-md w-full"
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
      </div>
    </div>
  );
};

export default Register;
