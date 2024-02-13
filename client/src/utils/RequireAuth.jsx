import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const RequireAuth = () => {
  const { reelBotUser } = useAuth();

  return reelBotUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
