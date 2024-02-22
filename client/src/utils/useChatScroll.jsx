import { useRef, useEffect } from "react";

// Custom hook to keep chat scrolled to the latest message
export const useChatScroll = (messages) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return ref;
};
