import { useAuth } from "../../utils/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";

import "./LoginForm.scss";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    try {
      await login(username, password);
      navigate("/chat");
    } catch (err) {
      setAuthError(err.response?.data?.msg || "Failed to log in");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Welcome back!</h1>
      <img src={Logo} alt="" className="logo" />
      {authError && (
        <p className="error-login-text">
          <img src="/alert-circle.svg" alt="Error" />
          {authError}
        </p>
      )}
      <label>Username</label>
      <input
        className={authError ? "error" : ""}
        name="Username"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your Username"
        type="text"
      />
      <label>Password</label>
      <input
        className={authError ? "error" : ""}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your password"
        type="password"
      />
      <button type="submit">Log in</button>
      <span className="signup-link" onClick={() => navigate("/signup")}>
        Don&apos;t have an account? <span id="darker">Create account →</span>
      </span>
    </form>
  );
};

export default LoginForm;
