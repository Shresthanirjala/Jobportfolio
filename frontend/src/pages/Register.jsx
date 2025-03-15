import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register, clearAllUserErrors } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const nichesArray = [
  "Software Development",
  "Web Development",
  "Cybersecurity",
  "Data Science",
  "Artificial Intelligence",
  "Cloud Computing",
  "DevOps",
  "Mobile App Development",
  "Blockchain",
  "Database Administration",
  "Network Administration",
  "UI/UX Design",
  "Game Development",
  "IoT (Internet of Things)",
  "Big Data",
  "Machine Learning",
  "IT Project Management",
  "IT Support and Helpdesk",
  "Systems Administration",
  "IT Consulting",
];

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
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.user
  );

  const {
    register: formRegister,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [role, setRole] = useState(""); // Set initial role as empty
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const onSubmit = async (data) => {
    console.log(data);

    const formData = new FormData();
    formData.append("role", data.role);
    formData.append("name", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("password", data.password);

    if (data.role === "Job Seeker") {
      formData.append("firstNiche", data.niche1);
      formData.append("secondNiche", data.niche2 || "");
      formData.append("thirdNiche", data.niche3 || "");
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
    }

    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      console.log('error:', error);
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      console.log('User authenticated, redirecting...');
      navigateTo("/");
    }
  }, [dispatch, error, loading, isAuthenticated, message]);

  return (
    <div className="px-4 md:px-16 lg:px-32 mt-16 md:mt-32 flex flex-col lg:flex-row gap-8 lg:gap-[35px] items-center lg:items-start">
      <div className="w-full lg:w-1/2">
        <img
          src="/images/register.png"
          className="w-full h-auto object-cover"
          alt="Register"
        />
      </div>

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
              {...formRegister("fullName")}
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
              {...formRegister("email")}
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
              {...formRegister("phone")}
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
              {...formRegister("address")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
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
              {...formRegister("password")}
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
              {...formRegister("confirmPassword")}
              className="border p-2 rounded-md w-full text-xs mt-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label htmlFor="role" className="text-xs text-[#023552]">
              Role
            </label>
            <select
              {...formRegister("role")}
              onChange={(e) => setRole(e.target.value)} // Handle the role change
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

          {/* Conditional Job Seeker Inputs */}
          {role === "Job Seeker" && (
            <>
              {/* Niche Selection (First Niche) */}
              <div className="flex flex-col">
                <label htmlFor="niche1" className="text-xs text-[#023552]">
                  First Niche
                </label>
                <select
                  {...formRegister("niche1")}
                  className="border p-2 rounded-md w-full text-xs mt-2"
                >
                  <option value="">Select your niche</option>
                  {nichesArray.map((niche, index) => (
                    <option key={index} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
                {errors.niche1 && (
                  <p className="text-red-500 text-xs">
                    {errors.niche1.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col mt-4">
                <label htmlFor="niche2" className="text-xs text-[#023552]">
                  Second Niche (Optional)
                </label>
                <select
                  {...formRegister("niche2")}
                  className="border p-2 rounded-md w-full text-xs mt-2"
                >
                  <option value="">Select your second niche</option>
                  {nichesArray.map((niche, index) => (
                    <option key={index} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col mt-4">
                <label htmlFor="niche3" className="text-xs text-[#023552]">
                  Third Niche (Optional)
                </label>
                <select
                  {...formRegister("niche3")}
                  className="border p-2 rounded-md w-full text-xs mt-2"
                >
                  <option value="">Select your third niche</option>
                  {nichesArray.map((niche, index) => (
                    <option key={index} value={niche}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col mt-4">
                <label htmlFor="coverLetter" className="text-xs text-[#023552]">
                  Cover Letter
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter"
                  rows={5}
                  className="border p-2 rounded-md w-full text-xs mt-2"
                />
              </div>

              <div className="flex flex-col mt-4">
                <label htmlFor="resume" className="text-xs text-[#023552]">
                  Upload Resume
                </label>
                <input
                  type="file"
                  onChange={resumeHandler}
                  className="border p-2 rounded-md w-full text-xs mt-2"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="bg-[#013954] text-white p-2 rounded-md mt-4 hover:bg-[#012a3a]"
            disabled={loading}
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
