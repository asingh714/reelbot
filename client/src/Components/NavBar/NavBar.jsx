import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import "./NavBar.scss";

const NavBar = () => {
  return (
    <nav>
      {/* <div> */}
      <Link to="/" className="logo-container">
        <img src={Logo} alt="ReelBot Logo" className="logo" />
        <h2>ReelBot</h2>
      </Link>
      {/* </div> */}
      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/chat">Chat</Link>
        <Link to="https://github.com/" target="_blank">
          GitHub
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
