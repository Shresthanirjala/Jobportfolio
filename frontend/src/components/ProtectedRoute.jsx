// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// export default function ProtectedRoute({ children, allowedRole }) {
//   const { user } = useContext(AuthContext);

//   if (!user) return <Navigate to="/login" />;

//   if (allowedRole && user.role.toLowerCase() !== allowedRole.toLowerCase()) {
//     return <Navigate to="/" />;
//   }

//   return children;
// }
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    // Optionally show a loading spinner here
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
