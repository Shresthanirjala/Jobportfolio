import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default ((router) => {
  router.post("/chat", async (req, res) => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }
      console.log(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(message);
      const reply = result.response.text();

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
