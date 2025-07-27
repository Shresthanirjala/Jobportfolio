import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";
import bcrypt from "bcrypt"

export const register = catchAsyncError(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
      niche1,
      niche2,
      niche3,
      coverLetter,
    } = req.body;

    // Map frontend fields to backend fields
    const firstNiche = niche1;
    const secondNiche = niche2;
    const thirdNiche = niche3;

    // ✅ Basic validation for required fields
    if (!name || !email || !phone || !address || !password || !role) {
      return next(new ErrorHandler("All fields are required.", 400));
    }

    if (role === "job Seeker" || role === "Job Seeker") {
      if (!firstNiche || !secondNiche || !thirdNiche) {
        return next(
          new ErrorHandler("Please provide your preferred job niches.", 400)
        );
      }

      if (!coverLetter) {
        return next(new ErrorHandler("Cover letter is required.", 400));
      }

      if (!req.files || !req.files.resume) {
        return next(new ErrorHandler("Resume upload is required.", 400));
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }

    const userData = {
      name,
      email,
      phone,
      address,
      password,
      role,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
      coverLetter,
    };

    // ✅ Resume upload (remove duplicate block)
    if (req.files && req.files.resume) {
      const { resume } = req.files;

      try {
        const originalFileName = resume.name;

        const cloudinaryResponse = await cloudinary.uploader.upload(
          resume.tempFilePath,
          {
            resource_type: "raw",
            folder: "Job_Seekers_Resume",
            public_id: originalFileName.replace(/\.[^/.]+$/, ""),
            format: "pdf",
          }
        );

        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return next(
            new ErrorHandler("Failed to upload resume to cloud.", 500)
          );
        }

        userData.resume = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        };
      } catch (error) {
        return next(new ErrorHandler("Failed to upload resume.", 500));
      }
    }

    const user = await User.create(userData);
    sendToken(user, 201, res, "User Registration.");
  } catch (error) {
    next(error);
  }
});

// Rest of your functions remain unchanged...
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  // Basic validation
  if (!email || !password || !role) {
    return next(new ErrorHandler("All fields (email, password, role) are required.", 400));
  }

  console.log(`Received login request for ${email} with role ${role}`);  // Log the input

  // Find user by email and role
  const user = await User.findOne({ email, role }).select("+password");

  // If user not found, return error
  if (!user) {
    console.log(`No user found with email: ${email} and role: ${role}`);
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  console.log(`User found: ${user.email} with role: ${user.role}`);  // Log user details for debugging

  // Compare entered password with stored hashed password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  // If password doesn't match
  if (!isPasswordMatched) {
    console.log("Password mismatch for user:", email);
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  // If everything is correct, generate and send JWT token
  sendToken(user, 200, res, `${role} logged in successfully.`);
});
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully,",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
  };
  const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;
  if (
    req.user.role === "job Seeker" &&
    (!firstNiche || !secondNiche || !thirdNiche)
  ) {
    return next(
      new ErrorHandler("Please provide your all preferred job niches.", 400)
    );
  }
  if (req.files) {
    const resume = req.files.resume;
    if (resume) {
      const currentResumeId = req.user.resume.public_id;
      if (currentResumeId) {
        await cloudinary.uploader.destroy(currentResumeId);
      }
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "Job_Seeker_resume",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
    message: "Profile updated.",
  });
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New Password & confirm password do not matched.", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res, "password updated successfully,");
});
