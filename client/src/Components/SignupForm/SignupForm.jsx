import { useAuth } from "../../utils/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../assets/alert-circle.svg";

import "./SignUpForm.scss";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [authError, setAuthError] = useState(null);
  const { register } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (password !== confirmPassword) {
      setAuthError("Your passwords must match");
    }

    try {
      await register(username, password, email);
      navigate("/chat");
    } catch (err) {
      setAuthError(err.response?.data?.msg || "Failed to sign up");
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      {authError && (
        <p className="error-signup-text">
          <img src={Alert} alt="Error" />
          {authError}
        </p>
      )}
      <label>Username</label>
      <input
        className={authError ? "error" : ""}
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Your Username"
        type="text"
      />
      <label>Email</label>
      <input
        className={authError ? "error" : ""}
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your Email"
        type="email"
      />
      <label>Password</label>
      <input
        className={authError ? "error" : ""}
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Your Password"
        type="password"
      />
      <label>Confirm Password</label>
      <input
        className={authError ? "error" : ""}
        name="confirmPassword"
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Your Password"
        type="password"
      />
      <button type="submit">Create Account</button>
      <span className="login-link" onClick={() => navigate("/login")}>
        Already have an account? <span id="darker">Login here →</span>
      </span>
    </form>
  );
};

export default SignUpForm;
