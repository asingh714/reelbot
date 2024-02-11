import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
