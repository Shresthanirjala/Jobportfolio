import React from "react";
import { useSelector } from "react-redux"; // Import useSelector hook
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify"; // For displaying unauthorized messages

// 'allowedRoles' prop लाई एउटा array को रूपमा पास गरिन्छ,
// जस्तै: <ProtectedRoute allowedRoles={["admin", "employer"]}>
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Redux store बाट authentication state access गर्नुहोस्
  const { isAuthenticated, user, authLoading } = useSelector(
    (state) => state.auth
  );

  // यदि authentication state लोड भइरहेको छ भने एक लोडिङ इन्डिकेटर देखाउनुहोस्
  // यो App.jsx मा पनि ह्यान्डल गर्न सकिन्छ, तर यहाँ पनि राख्नु सुरक्षित हुन्छ।
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading user authentication...
      </div>
    );
  }

  // यदि user authenticated छैन भने login page मा redirect गर्नुहोस्
  if (!isAuthenticated) {
    toast.error("Please log in to access this page.");
    return <Navigate to="/login" replace />;
  }

  // यदि `allowedRoles` prop पास गरिएको छ र user को role ती roles मध्ये छैन भने
  // unauthorized page वा home page मा redirect गर्नुहोस्।
  // user.role लाई सधैं lowercase मा तुलना गर्न सुनिश्चित गर्नुहोस्।
  if (allowedRoles && user && !allowedRoles.includes(user.role.toLowerCase())) {
    toast.error(
      `You are not authorized to view this page. Your role is ${user.role}.`
    );
    // Example: Redirect to home page or a specific unauthorized page
    return <Navigate to="/" replace />;
  }

  // यदि सबै conditions पूरा भए, children components लाई render गर्नुहोस्
  return children;
};

export default ProtectedRoute;
