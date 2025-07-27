import express from "express";
import {
  getAllEmployers,
  getAllSeekers,
  getAllJobs,
  getAllApplications,
  deleteUser,
  deleteJob,
} from "../controllers/adminController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

// Admin routes (ensure only authenticated admins can access)
router.get("/employers", isAuthenticated, isAuthorized("Admin"), getAllEmployers);
router.get("/seekers", isAuthenticated, isAuthorized("Admin"), getAllSeekers);
router.get("/jobs", isAuthenticated, isAuthorized("Admin"), getAllJobs);
router.get("/applications", isAuthenticated, isAuthorized("Admin"), getAllApplications);

// Admin delete routes
router.delete("/user/:id", isAuthenticated, isAuthorized("Admin"), deleteUser);
router.delete("/job/:id", isAuthenticated, isAuthorized("Admin"), deleteJob);

export default router;
