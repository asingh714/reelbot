import { useState, useEffect } from "react";
import axios from "axios";

import SuggestionOptions from "../SuggestionOptions/SuggestionOptions";
import { useChatScroll } from "../../utils/useChatScroll";
import newRequest from "../../utils/newRequest";
import NewChat from "../../assets/new-chat.svg";
import Send from "../../assets/send.svg";
import "./ChatBox.scss";
import MovieMessage from "../MovieMessage/MovieMessage";
import TextMessage from "../TextMessage/TextMessage";

// Main ChatBox component where users interact with ReelBot
const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [conversationId, setConversationId] = useState(null); // ID to track the current conversation for memory
  // Initial message from ReelBot
  const [messages, setMessages] = useState([
    {
      type: "message",
      sender: "app",
      content: "Hi I'm ReelBot! How can I help you find a movie?",
      timestamp: Date.now(),
    },
  ]);
  const messagesEndRef = useChatScroll(messages); // Custom hook to keep chat scrolled to the latest message

  // Effect hook to store the conversationId in local storage when it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem("conversationId", conversationId);
    }
  }, [conversationId]);

  // Effect hook to retrieve the conversationId from local storage when the component mounts
  useEffect(() => {
    const storedConversationId = localStorage.getItem("conversationId");
    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
  }, []);

  // Effect hook to clear conversationId from local storage when starting a new conversation
  useEffect(() => {
    if (
      messages.length === 1 &&
      messages[0].content === "Hi I'm ReelBot! How can I help you find a movie?"
    ) {
      localStorage.removeItem("conversationId");
      setConversationId(null);
    }
  }, [messages]);

  // Function to start a new conversation by resetting relevant state
  const startNewConversation = () => {
    localStorage.removeItem("conversationId");
    setConversationId(null);
    setMessages([
      {
        type: "message",
        sender: "app",
        content: "Hi I'm ReelBot! How can I help you find a movie?",
        timestamp: Date.now(),
      },
    ]);
    setQuery("");
  };

  // Fetch movie details from the TMDB API by movie ID
  const fetchMovie = async (id) => {
    try {
      const key = import.meta.env.VITE_TMDB_API_KEY;
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`
      );

      return data;
    } catch (error) {
      console.error("Fetching movie failed:", error);
    }
  };

  // Fetch movie trailer details from the TMDB API by movie ID
  const fetchTrailer = async (id) => {
    const key = import.meta.env.VITE_TMDB_API_KEY;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${key}&language=en-US`
    );
    return data;
  };

  // Fetch a movie recommendation based on the user's query or suggestion
  const fetchMovieRecommendation = async (suggestion) => {
    setIsLoading(true);
    try {
      const response = await newRequest.post(
        "/movieRec",

        {
          input: query || suggestion,
          conversationId,
        }
      );
      console.log("response", response);
      setIsLoading(false);

      if (
        response.data.conversationId &&
        response.data.conversationId !== conversationId
      ) {
        setConversationId(response.data.conversationId);
      }
      return response.data;
    } catch (error) {
      console.error("Fetching movie recommendation failed:", error);
      setIsLoading(false);
    }
  };

  // Handle the Enter key to submit the query without a newline
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitResponse(event);
    }
  };

  // Function to submit the user's query and process the response
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

    const response = await fetchMovieRecommendation(); // Fetch recommendation based on query

    setQuery(""); // Reset the query input field
    // Append ReelBot's response to the chat
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

  // Similar to submitResponse but triggered by selecting a suggestion
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

  // Update chat messages with detailed movie information
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

  // Handle selection of a movie suggestion
  const handleSelectSuggestion = (suggestion) => {
    submitResponseWithSuggestion(suggestion);
  };

  return (
    <div className="chat-box-container">
      <img
        src={NewChat}
        alt="New Chat"
        className="new-chat-icon"
        onClick={startNewConversation}
      />
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

      {isLoading && <p className="message-typing">ReelBot is thinking...</p>}

      <div className="chat-input">
        <form onSubmit={submitResponse}>
          <textarea
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            className="input-field"
            disabled={isLoading}
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
