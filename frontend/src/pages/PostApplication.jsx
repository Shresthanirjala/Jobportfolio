import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  MapPin,
  Calendar,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Target,
  Sparkles,
} from "lucide-react";
import { BASE_URL } from "../config/config";
import ApplyForm from "./ApplyForm";
import { useChatContext } from "../context/ChatContext";

const PostApplication = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { setCurrentJob } = useChatContext();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Carried over from the job listing when the user clicked a card that
  // already had a resume match score computed, so we don't have to
  // re-run the ML matching just to show it here.
  const match = location.state?.match || null;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/job/get/${jobId}`, {
          headers: user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {},
        });
        setJob(res.data.job);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load this job posting."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, user]);

  // Let the always-mounted chatbot bubble know which job is being viewed,
  // so it can answer questions about it directly. Cleared on unmount so
  // the bot doesn't keep talking about a job the user has navigated away
  // from.
  useEffect(() => {
    if (job) {
      setCurrentJob({ _id: job._id, title: job.title });
    }
    return () => setCurrentJob(null);
  }, [job, setCurrentJob]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!isAuthenticated || !user?.token) {
        setAppliedJobIds([]);
        return;
      }
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/application/my-applications`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (Array.isArray(res.data.applications)) {
          setAppliedJobIds(res.data.applications.map((app) => app.jobId));
        }
      } catch {
        setAppliedJobIds([]);
      }
    };
    fetchAppliedJobs();
  }, [isAuthenticated, user]);

  const isApplied = appliedJobIds.includes(jobId);
  const matchColor =
    match?.score >= 70
      ? "text-green-700 bg-green-100 border-green-300"
      : match?.score >= 40
      ? "text-amber-700 bg-amber-100 border-amber-300"
      : "text-gray-600 bg-gray-100 border-gray-300";

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isApplied) return;
    setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#718B68] border-opacity-50 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-[#013954]">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-lg mb-2">
            {error || "Job not found."}
          </div>
          <Link
            to="/findjobs"
            className="mt-4 inline-block bg-[#718B68] text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Back to Find Jobs
          </Link>
        </div>
      </div>
    );
  }

  const bulletList = (text) =>
    text
      ?.split(/\n|,\s*/)
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-10 md:px-16 lg:px-20 pt-28 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#013954] hover:text-[#718B68] font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </button>

        <div className="bg-white rounded-2xl shadow-[0px_4px_26px_#0000001a] p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#718B68] bg-opacity-10 rounded-xl">
                <Briefcase className="w-7 h-7 text-[#718B68]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-[#013954]">
                    {job.title}
                  </h1>
                  {match && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${matchColor}`}
                      title={`Semantic: ${match.semanticScore}% · Keyword: ${match.tfidfScore}%`}
                    >
                      <Target className="w-3 h-3" />
                      {match.score}% Match
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-gray-600">
                  <span className="font-medium">{job.companyName}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {job.jobPostedOn
                      ? new Date(job.jobPostedOn).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#718B68]">
                Rs {job.salary}
              </div>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {job.jobType}
            </span>
            {job.jobNiche && (
              <span className="px-3 py-1 bg-[#718B68] bg-opacity-10 text-[#718B68] rounded-full text-xs font-semibold border border-[#718B68]">
                {job.jobNiche}
              </span>
            )}
          </div>

          {job.introduction && (
            <p className="text-gray-700 leading-relaxed mb-6">
              {job.introduction}
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {job.responsibilities && (
              <div>
                <h3 className="font-semibold text-[#013954] mb-2">
                  Responsibilities
                </h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  {bulletList(job.responsibilities).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {job.qualifications && (
              <div>
                <h3 className="font-semibold text-[#013954] mb-2">
                  Qualifications
                </h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  {bulletList(job.qualifications).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {job.offers && (
            <div className="mb-6">
              <h3 className="font-semibold text-[#013954] mb-2">
                What We Offer
              </h3>
              <p className="text-gray-700 text-sm">{job.offers}</p>
            </div>
          )}

          {job.jobKeywords?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-[#013954] mb-2 text-sm">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.jobKeywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
            <button
              onClick={handleApply}
              disabled={isApplied}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                isApplied
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#013954] text-white hover:bg-[#025373]"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
              {!isApplied && <ArrowRight className="w-4 h-4" />}
            </button>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500">
                Log in as a Job Seeker to apply.
              </p>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg relative w-full max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowApplyModal(false)}
            >
              &times;
            </button>
            <ApplyForm
              jobId={job._id}
              jobTitle={job.title}
              appliedJobIds={appliedJobIds}
              onClose={() => setShowApplyModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostApplication;
