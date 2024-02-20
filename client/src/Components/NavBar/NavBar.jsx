import { Link } from "react-router-dom";

import { useAuth } from "../../utils/AuthContext";
import Logo from "@assets/logo.svg";
import "./NavBar.scss";

const NavBar = () => {
  const { reelBotUser, logout } = useAuth();

  if (reelBotUser) {
    return (
      <nav>
        <Link to="/" className="logo-container">
          <img src={Logo} alt="ReelBot Logo" className="logo" />
          <h2>ReelBot</h2>
        </Link>
        <div className="nav-links">
          <Link to="/chat">Chat</Link>
          <span onClick={() => logout()}>Logout</span>
          <Link to="https://github.com/" target="_blank">
            GitHub
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav>
      <Link to="/" className="logo-container">
        <img src={Logo} alt="ReelBot Logo" className="logo" />
        <h2>ReelBot</h2>
      </Link>
      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="https://github.com/" target="_blank">
          GitHub
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
