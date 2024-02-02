import { useState } from "react";
import moment from "moment";
import axios from "axios";

import SuggestionOptions from "../SuggestionOptions/SuggestionOptions";
import { useChatScroll } from "../../utils/useChatScroll";
import { useAuth } from "../../utils/AuthContext";
import Send from "../../assets/send.svg";
import "./ChatBox.scss";

const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [movie, setMovie] = useState({});
  const [messages, setMessages] = useState([
    {
      type: "message",
      sender: "app",
      content: "Hi I'm ReelBot! How can I help you find a movie?",
      timestamp: Date.now(),
    },
  ]);
  const { currentUser } = useAuth();
  const messagesEndRef = useChatScroll(messages);

  const fetchMovie = async (id) => {
    try {
      const key = import.meta.env.VITE_TMDB_API_KEY;
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`
      );
      console.log(data);
    } catch (error) {
      console.error("Fetching movie failed:", error);
    }
  };

  const fetchMovieRecommendation = async (suggestion) => {
    const response = await axios.post(
      "http://localhost:3001/movieRec",
      {
        input: query || suggestion,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitResponse(event);
    }
  };

  const submitResponse = async (event) => {
    if (event) event.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "message",
        sender: "user",
        content: query,
        timestamp: Date.now(),
      },
    ]);

    const response = await fetchMovieRecommendation();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "message",
        sender: "app",
        content: response.answer,
        timestamp: Date.now(),
      },
    ]);
    setQuery("");

    console.log(response.id);
    await fetchMovie(response.id);
  };

  const submitResponseWithSuggestion = async (suggestion) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "message",
        sender: "user",
        content: suggestion,
        timestamp: Date.now(),
      },
    ]);

    const response = await fetchMovieRecommendation(suggestion);

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "message",
        sender: "app",
        content: response.answer,
        timestamp: Date.now(),
      },
    ]);
    setQuery("");
  };

  const handleSelectSuggestion = (suggestion) => {
    submitResponseWithSuggestion(suggestion);
  };

  return (
    <div className="chat-box-container">
      <div className="messages-list">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "app"
                ? "message-container app"
                : "message-container user"
            }
          >
            <div className="message-sender-container">
              <span
                className={
                  message.sender === "app" ? "message-ai" : "message-user"
                }
              >
                {message.sender === "app"
                  ? "ReelBot"
                  : `${currentUser.username}`}
                <span id="lighter">
                  {" "}
                  · {moment(message.timestamp).format("LT")}
                </span>
              </span>
            </div>
            <p
              className={
                message.sender === "app" ? "message app" : "message user"
              }
            >
              {message.content}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {messages.length <= 1 && (
        <SuggestionOptions onSelectSuggestion={handleSelectSuggestion} />
      )}

      {/* {isLoading && <p className="message app">ReelBot is typing...</p>} */}

      <div className="chat-input">
        <form onSubmit={submitResponse}>
          <textarea
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            className="input-field"
          />
          <button type="submit" className="send-button">
            <img src={Send} alt="Send" className="send-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
