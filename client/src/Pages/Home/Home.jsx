import { motion } from "framer-motion";
import { useState } from "react";
import validator from "validator";

import "./Home.scss";
import badgeCheck from "../../assets/badge-check.svg";
import Zap from "../../assets/zap.svg";
import Infinite from "../../assets/infinity.svg";
import EyeOff from "../../assets/eye-off.svg";
import Logo from "../../assets/logo.svg";
import NavBar from "../../Components/NavBar/NavBar";
import FAQSection from "../../Components/FAQ/FAQ";
import Footer from "../../Components/Footer/Footer";

const Home = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (validator.isEmail(email)) {
      setNotification("Success! You are now subscribed.");
      setEmail("");
    } else {
      setError("Please enter a valid email address.");
    }
  };

  return (
    <motion.div
      className="home-page-container"
      animate={{
        backgroundPosition: ["0% 0%", "100% 0%"],
      }}
      transition={{
        duration: 80,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <NavBar />
      <div className="home-section">
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
                <li>No data stored</li>
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
        </main>

        <section className="feature-section">
          <div className="feature">
            <img src={EyeOff} alt="" className="feature-icon" />
            <h2 className="feature-heading">Privacy First</h2>
            <p className="feature-description">
              Your data stays yours — ReelBot doesn&apos;t collect it. Enjoy
              personalized movie picks in complete privacy.
            </p>
          </div>
          <div className="feature">
            <img src={Zap} alt="" className="feature-icon" />
            <h2 className="feature-heading">Feature-Rich</h2>
            <p className="feature-description">
              Rate films, manage watchlists, and explore with ReelBot&apos;s
              seamless, rich features for a tailored discovery.
            </p>
          </div>
          <div className="feature">
            <img src={Infinite} alt="" className="feature-icon" />
            <h2 className="feature-heading">Unlimited Discovery</h2>
            <p className="feature-description">
              No caps on recommendations. ReelBot is your endless cinema
              library, crafted to your evolving tastes.
            </p>
          </div>
        </section>
        <FAQSection />

        <section className="cta-section">
          <h2 className="cta-heading">Stay in the loop</h2>
          <p className="cta-description">
            Be the first to discover what&apos;s new with ReelBot. Join our
            community and be at the forefront of the latest movie
            recommendations and features.
          </p>

          <div className="messages">
            {notification && (
              <p className="notification-message">{notification}</p>
            )}
            {error && <p className="error-message">{error}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className={`cta-input ${error} ? "error" : ""`}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="🎥 Join 2.5K+ movie enthusiasts following ReelBot's journey"
              type="text"
            />
            <button type="submit" className="cta-button">
              Subscribe
            </button>
          </form>
        </section>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Home;
