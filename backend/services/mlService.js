import axios from "axios";
import FormData from "form-data";

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://localhost:5001/parse-resume";

export const analyzeResume = async (cvUrl, jobsPayload) => {
  const fileResponse = await axios.get(cvUrl, {
    responseType: "arraybuffer",
  });

  const urlPath = new URL(cvUrl).pathname;
  const extension = urlPath.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  const contentType = fileResponse.headers["content-type"]?.split(";")[0];
  const extensionByType = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
  };
  const filename = `resume.${extension || extensionByType[contentType] || "pdf"}`;

  const formData = new FormData();
  formData.append("file", Buffer.from(fileResponse.data), {
    filename,
  });
  formData.append("jobs", JSON.stringify(jobsPayload));

  const response = await axios.post(ML_SERVICE_URL, formData, {
    headers: formData.getHeaders(),
    // Skill extraction now calls Gemini (with retries on transient errors),
    // which is slower and less predictable than the old local keyword match.
    timeout: 60000,
  });

  return response.data;
};