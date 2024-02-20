import { Link } from "react-router-dom";
import Logo from "@assets/logo.svg";

const ChatNav = () => {
  return (
    <div className="chat-nav-container">
      <Link to="/" className="logo">
        <div className="logo-container">
          <img src={Logo} alt="" />
          <span>ReelBot</span>
        </div>
      </Link>
    </div>
  );
};

export default ChatNav;
