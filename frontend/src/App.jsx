import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Fixed import
import Home from "./pages/Home"; // Corrected import
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import PostApplication from "./pages/PostApplication";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import About from "./pages/About";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import FindJobs from "./pages/FindJobs";
import MyProfile from "./pages/MyProfile";
import EmployerDashboard from "./pages/Employedashboard/EmployerDashboard";
import ProtectedRoute from "./components/ProtectedRoute"

const user = {
  role: "Employer",
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/findjobs" element={<FindJobs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post/application/:jobId" element={<PostApplication />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute user={user} allowedRole="Employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}
