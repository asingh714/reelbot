import PropTypes from "prop-types";
import moment from "moment";

import "./MovieMessage.scss";

const MovieMessage = ({ message }) => {
  return (
    <div key={message.timestamp} className="movie-message">
      <img src={`https://image.tmdb.org/t/p/w300/${message.poster}`} alt="" />
      <div className="movie-text-container">
        <h2>
          {message.title} ({moment(message.release_date).format("YYYY")})
        </h2>
        <p>{message.overview}</p>
        <span>{message.tagline}</span>
        <a href={message.videoURL} target="_blank" rel="noopener noreferrer">
          Watch trailer
        </a>
      </div>
    </div>
  );
};

MovieMessage.propTypes = {
  message: PropTypes.shape({
    timestamp: PropTypes.number,
    title: PropTypes.string,
    overview: PropTypes.string,
    poster: PropTypes.string,
    backdrop: PropTypes.string,
    tagline: PropTypes.string,
    videoURL: PropTypes.string,
    release_date: PropTypes.string,
  }),
};

export default MovieMessage;
