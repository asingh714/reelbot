import PropTypes from "prop-types";

import "./SuggestionOptions.scss";

const suggestions = [
  "Give me a recommendation for a movie to watch with an astrophysicist",
  "What's a good movie for a rainy day?",
  "I'd like a movie that makes me think about the future",
  "Find me a movie that's perfect to watch with my 5 year old daughter",
];

const SuggestionOptions = ({ onSelectSuggestion }) => {
  return (
    <div className="suggestions-container">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="suggestion-button"
          onClick={() => onSelectSuggestion(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

SuggestionOptions.propTypes = {
  onSelectSuggestion: PropTypes.func,
};

export default SuggestionOptions;
