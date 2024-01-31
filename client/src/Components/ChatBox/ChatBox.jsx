import { useState } from "react";
import moment from "moment";
import Send from "../../assets/send.svg";

import "./ChatBox.scss";
import { useChatScroll } from "../../utils/useChatScroll";

const ChatBox = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "app",
      content: "Hi I'm ReelBot! How can I help you find a movie?",
      timestamp: Date.now(),
    },
  ]);

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
              <span className="message-sender">
                {message.sender === "app" ? "ReelBot" : "USER"}
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

      <form onSubmit={submitResponse} className="input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write a message..."
          className="input-field"
        />
        <img
          src={Send}
          alt="Search"
          className="send-icon"
          onClick={submitResponse}
        />
      </form>
    </div>
  );
};

export default ChatBox;
