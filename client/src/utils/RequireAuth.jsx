import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Custom hook to require authentication before rendering a component
const RequireAuth = () => {
  const { reelBotUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reelBotUser !== undefined) {
      setIsLoading(false);
    }
  }, [reelBotUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return reelBotUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
