import { Link } from "react-router-dom";

import Logo from "../../assets/logo.svg";
import "./NavBar.scss";

const NavBar = () => {
  return (
    <nav>
      <div className="logo-container">
        <img src={Logo} alt="ReelBot Logo" className="logo" />
        <h2>ReelBot</h2>
      </div>
      <ul className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/chat">Chat</Link>
        <Link to="https://github.com/" target="_blank">
          GitHub
        </Link>
      </ul>
    </nav>
  );
};

export default NavBar;
