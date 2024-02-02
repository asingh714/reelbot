import moment from "moment";
import PropTypes from "prop-types";

import { useAuth } from "../../utils/AuthContext";
import "./TextMessage.scss";

const TextMessage = ({ message }) => {
  const { currentUser } = useAuth();
  return (
    <div
      key={message.timestamp}
      className={`message-container ${
        message.sender === "app" ? "app" : "user"
      }`}
    >
      <div className="message-sender-container">
        <span
          className={message.sender === "app" ? "message-ai" : "message-user"}
        >
          {message.sender === "app" ? "ReelBot" : currentUser.username}
          <span id="lighter"> · {moment(message.timestamp).format("LT")}</span>
        </span>
      </div>
      <p className={message.sender === "app" ? "message app" : "message user"}>
        {message.content}
      </p>
    </div>
  );
};

TextMessage.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string,
    timestamp: PropTypes.number,
    content: PropTypes.string,
  }),
};

export default TextMessage;
