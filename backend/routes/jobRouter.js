import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  postJob,
  getAllJobs,
  getASingleJob,
  getMyJobs,
  deleteJobs,
} from "../controllers/jobController.js";

const router = express.Router();
router.post("/post", isAuthenticated, isAuthorized("Employer"), postJob);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Employer"),
  deleteJobs
);
router.get("/get/:id", isAuthenticated, getASingleJob);

export default router;
