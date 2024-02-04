import { useState } from "react";
import axios from "axios";

import SuggestionOptions from "../SuggestionOptions/SuggestionOptions";
import { useChatScroll } from "../../utils/useChatScroll";
import Send from "../../assets/send.svg";
import "./ChatBox.scss";
import MovieMessage from "../MovieMessage/MovieMessage";
import TextMessage from "../TextMessage/TextMessage";

const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "message",
      sender: "app",
      content: "Hi I'm ReelBot! How can I help you find a movie?",
      timestamp: Date.now(),
    },
  ]);

  const messagesEndRef = useChatScroll(messages);

  const fetchMovie = async (id) => {
    try {
      const key = import.meta.env.VITE_TMDB_API_KEY;
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`
      );

      /*
      poster_path --> image 
      title --> string
      release_date --> just get year here 
      tagline --> string 
      */

      return data;
    } catch (error) {
      console.error("Fetching movie failed:", error);
    }
  };

  const fetchTrailer = async (id) => {
    const key = import.meta.env.VITE_TMDB_API_KEY;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${key}&language=en-US`
    );
    // key from data will have youtube id. const youtubeUrl = `https://www.youtube.com/watch?v=${video.key}`;
    return data;
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

    setQuery("");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "message",
        sender: "app",
        content: response.answer,
        timestamp: Date.now(),
      },
    ]);

    await updateMessagesWithMovie(response.id);
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
    console.log("movie", response);
    setQuery("");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "message",
        sender: "app",
        content: response.answer,
        timestamp: Date.now(),
      },
    ]);

    await updateMessagesWithMovie(response.id);
  };

  const updateMessagesWithMovie = async (id) => {
    const movieData = await fetchMovie(id);
    const videoData = await fetchTrailer(id);

    const key = videoData.results[0]?.key;
    const movie = {
      poster: movieData.poster_path,
      backdrop: movieData.backdrop_path,
      title: movieData.title,
      release_date: movieData.release_date,
      tagline: movieData.tagline,
      overview: movieData.overview,
      videoURL: `https://www.youtube.com/watch?v=${key}`,
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "movie",
        sender: "app",
        timestamp: Date.now(),
        ...movie,
      },
    ]);
    return;
  };
  const handleSelectSuggestion = (suggestion) => {
    submitResponseWithSuggestion(suggestion);
  };

  return (
    <div className="chat-box-container">
      <div className="messages-list">
        {messages.map((message) => {
          if (message.type === "message") {
            return <TextMessage key={message.timestamp} message={message} />;
          } else {
            return <MovieMessage key={message.timestamp} message={message} />;
          }
        })}
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
