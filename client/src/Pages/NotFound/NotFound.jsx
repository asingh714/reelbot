import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Logo from "../../assets/logo.svg";
import "./NotFound.scss";
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";

const NotFound = () => {
  return (
    <div className="not-found-page-container">
      <NavBar />
      <div className="not-found-page-content">
        <motion.img
          initial={{
            rotate: "0deg",
          }}
          animate={{
            rotate: "360deg",
          }}
          transition={{
            duration: 1.5,
            type: "spring",
            repeat: Infinity,
            ease: "easeInOut",
          }}
          src={Logo}
          alt="ReelBot Logo"
          className="main-logo"
        />
        <h1 className="not-found-title">404 - Scene Not Found</h1>
        <p className="not-found-text">
          Oops! It looks like this page is not in our script. Let&apos;s get you
          back to the main storyline.
        </p>
        <Link to="/" className="not-found-home-button">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
