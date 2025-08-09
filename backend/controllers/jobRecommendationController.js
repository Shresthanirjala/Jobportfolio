import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";

// Jaccard Similarity function (works on arrays of phrases)
function jaccardSimilarity(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0; // avoid division by zero
  return intersection.size / union.size;
}

// Synonym normalization map for phrases
const synonymMap = {
  designing: "design",
  designer: "design",
  design: "design",
  creative: "create",
  creativity: "create",
  creating: "create",
  developing: "develop",
  development: "develop",
  developer: "develop",
};

// Normalize phrases by normalizing each word inside phrase
function normalizePhrase(phrase) {
  return phrase
    .split(/\s+/)               // split phrase into words
    .map((word) => synonymMap[word] || word) // normalize each word
    .join(" ");                 // join back to phrase
}

function normalizePhrases(phrases) {
  return phrases
    .map((phrase) => phrase.toLowerCase().trim())
    .filter(Boolean)            // remove empty strings
    .map(normalizePhrase);
}

// Controller
export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const pastApplications = await Application.find({
      "jobSeekerInfo.id": userId,
    });

    let userKeywords = [];

    if (pastApplications.length > 0) {
      // Use past job application keywords as whole phrases
      const appliedJobIds = pastApplications.map((app) => app.jobInfo.jobId);
      const appliedJobs = await Job.find({ _id: { $in: appliedJobIds } });

      const keywordsSet = new Set();

      appliedJobs.forEach((job) => {
        // Assume jobKeywords is a comma-separated string of phrases
        const rawPhrases = String(job?.jobKeywords || job?.jobtitle || "")
          .split(",")
          .map((phrase) => phrase.trim());
        const normalized = normalizePhrases(rawPhrases);
        normalized.forEach((phrase) => keywordsSet.add(phrase));
      });

      userKeywords = [...keywordsSet];
    } else {
      // Use user profile niches as whole phrases (no splitting by spaces)
      userKeywords = [
        req.user.niches?.firstNiche || "",
        req.user.niches?.secondNiche || "",
        req.user.niches?.thirdNiche || "",
      ]
        .filter(Boolean)
        .map((phrase) => phrase.toLowerCase().trim());
      userKeywords = normalizePhrases(userKeywords);
    }

    // Fetch all jobs
    const allJobs = await Job.find();

    const scoredJobs = allJobs.map((job) => {
      // Assume jobKeywords or jobNiche is comma-separated phrases
      const rawPhrases = String(job?.jobKeywords || job?.jobNiche || "")
        .split(",")
        .map((phrase) => phrase.trim());
      const normalized = normalizePhrases(rawPhrases);

      const score = jaccardSimilarity(userKeywords, normalized);
      return { job, score };
    });

    // Sort, filter and take top 10
    const recommendedJobs = scoredJobs
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .map((item) => item.job)
      .slice(0, 10);

    res.status(200).json({ recommendedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
