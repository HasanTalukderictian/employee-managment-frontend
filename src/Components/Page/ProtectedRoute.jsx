
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role, allowedRole }) => {
  if (role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;

