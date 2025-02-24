import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";

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
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// newsLetterCron();
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

app.use(errorMiddleware);
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Start the server
app.listen(port, () => {
  console.log(`server is running on PORT ${port}`);
});
