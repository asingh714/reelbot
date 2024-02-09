import { motion } from "framer-motion";

import "./Home.scss";
import badgeCheck from "../../assets/badge-check.svg";
import Logo from "../../assets/logo.svg";
import NavBar from "../../Components/NavBar/NavBar";

const Home = () => {
  return (
    <motion.div
      className="home-page-container"
      animate={{
        backgroundPosition: ["0% 0%", "100% 0%"],
      }}
      transition={{
        duration: 60,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <NavBar />

      <main className="hero-section">
        <div className="hero-main-section">
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
            className="hero-logo"
          />
          <h1 className="main-heading">Your Personal Movie Advisor</h1>
          <p className="sub-heading">
            Find your perfect movie with ReelBot. Personalized picks, endless
            enjoyment.
          </p>
          <ul className="list-items">
            <div className="list-item">
              <img src={badgeCheck} alt="check-mark" />
              <li>No sign-up required</li>
            </div>
            <div className="list-item">
              <img src={badgeCheck} alt="check-mark" />
              <li>Curated by AI with love</li>
            </div>
            <div className="list-item">
              <img src={badgeCheck} alt="check-mark" />
              <li>Instant recommendations</li>
            </div>
          </ul>
          <button className="header-cta">
            Start Chatting - It&apos;s Free!
          </button>
        </div>

        <div className="hero-video-section">
          <img src={Logo} alt="" className="video-test" />
        </div>

        {/* <div className="hero-review-section">
          <span>Trusted by Movie Lovers Everywhere</span>
          <span>★★★★★ 4.8/5 from 250K+ interactions</span>
        </div>
        <div className="hero-trusted-by-section">
          <span>Cinema World | Film Daily | The Movie Buff Blog</span>
        </div> */}
      </main>
    </motion.div>
  );
};

export default Home;
