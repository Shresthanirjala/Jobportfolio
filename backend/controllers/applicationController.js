import { catchAsyncError } from "../middlewares/catchAsyncError";

export const postApplication = catchAsyncError(async (req, res, next) => {});
export const employerGetAllApplication = catchAsyncError(
  async (req, res, next) => {}
);
export const jobSeekerGetAllApplication = catchAsyncError(
  async (req, res, next) => {}
);
export const deleteApplication = catchAsyncError(async (req, res, next) => {});
