import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

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
    const response = await axios.post(
      "http://localhost:3001/login",
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
    setReelBotUser(response.data.user);
    localStorage.setItem("reelBotUser", JSON.stringify(response.data.user));
  };

  const register = async (username, password, email) => {
    const response = await axios.post(
      "http://localhost:3001/register",
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    setReelBotUser(response.data.user);
    localStorage.setItem("reelBotUser", JSON.stringify(response.data.user));
  };

  const logout = () => {
    localStorage.removeItem("reelBotUser");
    setReelBotUser(null);
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
