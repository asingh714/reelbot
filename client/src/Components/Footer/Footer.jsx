import { Link } from "react-router-dom";
import Heart from "../../assets/heart.svg";

import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer-container">
      <Link to="https://www.amans.dev" target="_blank">
        <span>
          Made with <img src={Heart} alt="" /> by Aman
        </span>
      </Link>
      <img
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
        alt=""
        className="tmdb-logo"
      />
    </footer>
  );
};

export default Footer;
