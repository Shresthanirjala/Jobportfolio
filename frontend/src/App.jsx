import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Dashboard from "./pages/Dashboard";
import PostApplication from "./pages/PostApplication";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FindJobs from "./pages/FindJobs";
import MyProfile from "./pages/MyProfile";
import EmployerDashboard from "./pages/Employedashboard/EmployerDashboard";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";
import EmployerNavbar from "./pages/Employedashboard/EmployerNavbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Context
import { AuthContext } from "./context/AuthContext";

export default function App() {
  const { user } = useContext(AuthContext);
  const role = user?.role?.toLowerCase();

  return (
    <Router>
      {/* Show different navbars based on role */}
      {role === "employer" ? <EmployerNavbar /> : <Navbar />}

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

        {/* Protected route only for employers */}
        {/* <Route
          path="/employer/dashboard/:id"
          element={
            <ProtectedRoute allowedRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route
  path="/employer/dashboard/:id"
  element={
    <ProtectedRoute>
      <EmployerDashboard />
    </ProtectedRoute>
  }/>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}
