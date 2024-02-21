import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import newRequest from "../utils/newRequest";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [reelBotUser, setReelBotUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("reelBotUser");
    if (storedUser) {
      setReelBotUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username, password) => {
    const response = await newRequest.post("/login", {
      username,
      password,
    });
    setReelBotUser(response.data.user);
    localStorage.setItem("reelBotUser", JSON.stringify(response.data.user));
  };

  const register = async (username, password, email) => {
    const response = await newRequest.post("/register", {
      username,
      email,
      password,
    });
    setReelBotUser(response.data.user);
    localStorage.setItem("reelBotUser", JSON.stringify(response.data.user));
  };

  const logout = async () => {
    try {
      await newRequest.post("/logout");
      localStorage.removeItem("reelBotUser");
      setReelBotUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const value = {
    reelBotUser,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
