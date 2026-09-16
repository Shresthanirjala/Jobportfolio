import { createContext, useContext, useState } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [currentJob, setCurrentJob] = useState(null);

  return (
    <ChatContext.Provider value={{ currentJob, setCurrentJob }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return ctx;
}
