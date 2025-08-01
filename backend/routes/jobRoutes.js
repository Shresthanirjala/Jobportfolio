import express from "express";
import { getRecommendedJobs } from "../controllers/jobRecommendationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, getRecommendedJobs);

export default router;
