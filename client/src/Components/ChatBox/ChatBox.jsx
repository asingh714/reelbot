import { useState } from "react";
import moment from "moment";

import SuggestionOptions from "../SuggestionOptions/SuggestionOptions";
import { useChatScroll } from "../../utils/useChatScroll";
import Send from "../../assets/send.svg";

import "./ChatBox.scss";
import { useAuth } from "../../utils/AuthContext";

const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "app",
      content: "Hi I'm ReelBot! How can I help you find a movie?",
      timestamp: Date.now(),
    },
  ]);

  const { currentUser } = useAuth();

  const messagesEndRef = useChatScroll(messages);

  const submitResponse = async (event) => {
    event.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "user",
        content: query,
        timestamp: Date.now(),
      },
    ]);

    setQuery("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitResponse(event);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    submitResponseWithSuggestion(suggestion);
  };

  const submitResponseWithSuggestion = async (suggestion) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "user",
        content: suggestion,
        timestamp: Date.now(),
      },
    ]);
    setQuery("");
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
