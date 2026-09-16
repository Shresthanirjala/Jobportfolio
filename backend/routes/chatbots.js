import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Job } from "../models/jobSchema.js";

const GEMINI_MODEL = "gemini-flash-latest";
const MAX_ATTEMPTS = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (model, message) => {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await model.generateContent(message);
      return result.response.text();
    } catch (error) {
      const isRetryable = [429, 500, 502, 503, 504].includes(error.status);
      if (!isRetryable || attempt === MAX_ATTEMPTS) {
        throw error;
      }
      await sleep(2 ** attempt * 1000); // 2s, 4s
    }
  }
};

const buildSystemInstruction = async (jobId) => {
  const activeJobs = await Job.find()
    .select("_id title companyName location jobType jobNiche salary")
    .limit(30)
    .lean();

  const jobsSummary = activeJobs
    .map(
      (job) =>
        `- [${job._id}] ${job.title} at ${job.companyName} (${job.location}, ${job.jobType}, ${job.salary})`
    )
    .join("\n");

  let currentJobDetail = "";
  if (jobId) {
    const job = await Job.findById(jobId).lean();
    if (job) {
      currentJobDetail = `\n\nThe user is currently viewing this specific job posting, prioritize answering about it when relevant:
Title: ${job.title}
Company: ${job.companyName}
Location: ${job.location}
Type: ${job.jobType}
Salary: ${job.salary}
Niche: ${job.jobNiche}
Introduction: ${job.introduction || "N/A"}
Responsibilities: ${job.responsibilities || "N/A"}
Qualifications: ${job.qualifications || "N/A"}
Offers: ${job.offers || "N/A"}`;
    }
  }

  return `You are the helpful assistant for "Job Portfolio", a job listing and application platform. \
Answer questions about the platform, how to apply, and the jobs currently posted. Keep replies concise \
and friendly. Only talk about jobs listed below - never invent job openings that aren't listed.

Currently active job postings:
${jobsSummary || "(no active jobs posted right now)"}${currentJobDetail}`;
};

export default ((router) => {
  router.post("/chat", async (req, res) => {
    try {
      const { message, jobId } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const systemInstruction = await buildSystemInstruction(jobId);

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction,
      });
      const reply = await generateWithRetry(model, message);

      res.json({ reply });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "An error occurred while communicating with the chatbot.",
      });
    }
  });
  return router;
})(express.Router());
