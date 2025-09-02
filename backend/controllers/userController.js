import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";
import bcrypt from "bcryptjs"; 

export const register = catchAsyncError(async (req, res, next) => {
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

  const firstNiche = niche1;
  const secondNiche = niche2;
  const thirdNiche = niche3;

  if (!name || !email || !phone || !address || !password || !role) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  if (role.toLowerCase() === "job seeker") {
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

  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {
          resource_type: "raw",
          folder: "Job_Seekers_Resume",
          public_id: resume.name.replace(/\.[^/.]+$/, ""),
          format: "pdf",
        }
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Failed to upload resume to cloud.", 500));
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
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(
      new ErrorHandler("All fields (email, password, role) are required.", 400)
    );
  }

  const user = await User.findOne({ email, role }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }

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
      message: "Logged out successfully",
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
  // Extract niches from request body, defaulting to empty strings if missing
  const niches = {
    firstNiche: req.body.firstNiche || "",
    secondNiche: req.body.secondNiche || "",
    thirdNiche: req.body.thirdNiche || "",
    fourthNiche: req.body.fourthNiche || "",
    fifthNiche: req.body.fifthNiche || "",
    sixthNiche: req.body.sixthNiche || "",
    seventhNiche: req.body.seventhNiche || "",
  };

  // Validate that for job seekers, at least 3 niches are provided (adjust as needed)
  if (
    req.user.role.toLowerCase() === "job seeker" &&
    (!niches.firstNiche || !niches.secondNiche || !niches.thirdNiche)
  ) {
    return next(
      new ErrorHandler("Please provide your all preferred job niches.", 400)
    );
  }

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    niches, // save all 7 niches together
  };

  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const currentResumeId = req.user.resume?.public_id;

    if (currentResumeId) {
      await cloudinary.uploader.destroy(currentResumeId);
    }

    const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
      resource_type: "raw",
      folder: "Job_Seekers_Resume",
    });

    newUserData.resume = {
      public_id: newResume.public_id,
      url: newResume.secure_url,
    };
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
  const isPasswordMatched = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New Password & confirm password do not match.", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res, "Password updated successfully.");
});
