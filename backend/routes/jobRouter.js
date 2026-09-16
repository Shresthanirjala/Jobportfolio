import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  postJob,
  getAllJobs,
  getASingleJob,
  getMyJobs,
  deleteJobs,
} from "../controllers/jobController.js";
import { handleResumeAnalysis } from "../controllers/matchController.js";

const router = express.Router();
router.post("/post", isAuthenticated, isAuthorized("Employer"), postJob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.post(
  "/analyze-resume",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  handleResumeAnalysis
);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Employer"),
  deleteJobs
);
router.get("/get/:id", isAuthenticated, getASingleJob);

export default router;
