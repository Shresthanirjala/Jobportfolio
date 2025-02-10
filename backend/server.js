import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = 3000;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

app.get("/", (req, res) => {
  res.send("hello Nirjala");
});

app.use(errorMiddleware)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

