import PropTypes from "prop-types";

import "./SuggestionOptions.scss";

// A predefined list of movie suggestion prompts
const allSuggestions = [
  "Give me a recommendation for a movie to watch with an astrophysicist",
  "What's a good movie for a rainy day?",
  "I'd like a movie that makes me think about the future",
  "Find me a movie that's perfect to watch with my 5 year old daughter",
  "Suggest a film that explores artificial intelligence",
  "What's a great movie for a long flight?",
  "Recommend a movie that's a visual masterpiece",
  "Give me a film that delves deep into human emotions",
  "Give me a movie for someone fascinated by ancient civilizations",
  "The best movie for a thrilling adventure",
  "Recommend a heartwarming film for the whole family",
  "Recommend a movie that showcases breathtaking landscapes",
  "What's a good film for a deep discussion?",
  "I'd like a movie that's ideal for a first date",
  "Recommend a movie that breaks the fourth wall",
  "I'd like a film that revolutionized cinema",
  "Suggest a movie with an unforgettable soundtrack",
  "What's a movie that's best watched in the dark?",
  "What's the best film for aspiring filmmakers?",
  "What's a movie that's known for its plot twists?",
];

// Generates a specified number of random, unique suggestions from a list.
function getRandomSuggestions(suggestions, numItems) {
  let result = new Set();
  while (result.size < numItems) {
    let randomIndex = Math.floor(Math.random() * suggestions.length);
    result.add(suggestions[randomIndex]);
  }
  return Array.from(result);
}

// Generate a random set of 4 suggestions to display to the user
const suggestions = getRandomSuggestions(allSuggestions, 4);

// SuggestionOptions Component displays a set of random movie suggestion buttons to the user.
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
