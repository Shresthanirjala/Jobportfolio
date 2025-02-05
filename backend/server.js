import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect( process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB Successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

  app.get('/', (req, res)=>{
    res.send("hello Nirjala")
  })

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
