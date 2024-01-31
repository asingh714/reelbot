import { useRef, useEffect } from "react";

export const useChatScroll = (messages) => {
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return ref;
};
