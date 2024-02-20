import { useState, useEffect } from "react";
import axios from "axios";

import SuggestionOptions from "../SuggestionOptions/SuggestionOptions";
import { useChatScroll } from "../../utils/useChatScroll";
import NewChat from "../../assets/new-chat.svg";
import Send from "../../assets/send.svg";
import "./ChatBox.scss";
import MovieMessage from "../MovieMessage/MovieMessage";
import TextMessage from "../TextMessage/TextMessage";

const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([
    {
      type: "message",
      sender: "app",
      content: "Hi I'm ReelBot! How can I help you find a movie?",
      timestamp: Date.now(),
    },
  ]);
  const messagesEndRef = useChatScroll(messages);

  useEffect(() => {
    if (conversationId) {
      localStorage.setItem("conversationId", conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    const storedConversationId = localStorage.getItem("conversationId");
    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
  }, []);

  useEffect(() => {
    if (
      messages.length === 1 &&
      messages[0].content === "Hi I'm ReelBot! How can I help you find a movie?"
    ) {
      localStorage.removeItem("conversationId");
      setConversationId(null);
    }
  }, [messages]);

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

  const fetchTrailer = async (id) => {
    const key = import.meta.env.VITE_TMDB_API_KEY;
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${key}&language=en-US`
    );
    return data;
  };

  const fetchMovieRecommendation = async (suggestion) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://reelbot-server.onrender.com/movieRec",

        {
          input: query || suggestion,
          conversationId,
        },
        {
          withCredentials: true,
        }
      );
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
