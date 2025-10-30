import { useEffect } from "react"; // Add useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { checkAuthStatus } from "./redux/actions/authActions"; // Import your Redux action

// Pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
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

import MyJobApplications from "./pages/MyJobApplications";
import PersonalInformation from "./pages/PersonalInformation";
import ApplyForm from "./pages/ApplyForm";
import AdminDashboard from "./pages/Admindashboard/Dashboard";
import ChatbotBubble from "./components/ChatbotBubble";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.authLoading);

  const role = user?.role?.toLowerCase();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading authentication...
      </div>
    );
  }

  return (
    <Router>
      {/*  different navbars based on role */}
      {role === "employer" ? <EmployerNavbar /> : <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/findjobs" element={<FindJobs />} />
        <Route path="/post/application/:jobId" element={<PostApplication />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/apply-form" element={<ApplyForm />} />
        <Route path="/my-applications" element={<MyJobApplications />} />{" "}
        {/* Assuming this route exists */}
        <Route path="/personal-info" element={<PersonalInformation />} />{" "}
        {/* Protected route for employers */}
        <Route
          path="/employer/dashboard/:id"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              {" "}
              {/* Pass allowedRoles as an array */}
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Protected route for Job Seekers, e.g., MyProfile, MyJobApplications */}
        <Route
          path="/myprofile"
          element={
            <ProtectedRoute allowedRoles={["job seeker"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["job seeker"]}>
              <MyJobApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-info"
          element={
            <ProtectedRoute allowedRoles={["job seeker", "employer", "admin"]}>
              {" "}
              {/* Adjust as needed */}
              <PersonalInformation />
            </ProtectedRoute>
          }
        />
        {/* If PostApplication requires login, protect it */}
        <Route
          path="/post/application/:jobId"
          element={
            <ProtectedRoute allowedRoles={["job seeker", "employer", "admin"]}>
              {" "}
              <PostApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-form"
          element={
            <ProtectedRoute allowedRoles={["job seeker"]}>
              <ApplyForm />
            </ProtectedRoute>
          }
        />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <ChatbotBubble />
    </Router>
  );
}
