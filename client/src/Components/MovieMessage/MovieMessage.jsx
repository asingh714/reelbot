import PropTypes from "prop-types";
import moment from "moment";

import "./MovieMessage.scss";

const MovieMessage = ({ message }) => {
  return (
    <div key={message.timestamp} className="movie-message">
      <h1>{message.title}</h1>
      <img src={message.poster} alt="" />
      <span>{message.tagline}</span>
      <span>{message.videoURL}</span>
      <span>{moment(message.release_date).format("YYYY")}</span>
    </div>
  );
};

MovieMessage.propTypes = {
  message: PropTypes.shape({
    timestamp: PropTypes.number,
    title: PropTypes.string,
    poster: PropTypes.string,
    tagline: PropTypes.string,
    videoURL: PropTypes.string,
    release_date: PropTypes.string,
  }),
};

export default MovieMessage;
