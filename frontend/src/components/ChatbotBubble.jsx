import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/config";
import { useChatContext } from "../context/ChatContext";

function Chatbot() {
  const { currentJob } = useChatContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm the Job Portfolio assistant. Ask me about open positions, how to apply, or anything about the job you're viewing.",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || sending) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, sender: "user" },
    ]);
    setInputValue("");
    setSending(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/chatbot/chat`, {
        message: text,
        jobId: currentJob?._id,
      });
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: res.data.reply, sender: "bot" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I couldn't reach the chatbot right now. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-[#718B68] to-[#5a7355] text-white p-4 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <h3 className="font-semibold text-sm">Chat Assistant</h3>
            <p className="text-xs text-white text-opacity-80">
              {currentJob ? `Asking about: ${currentJob.title}` : "Online now"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container - Fixed height with scroll */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 min-h-0"
        style={{ maxHeight: "300px" }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                message.sender === "user"
                  ? "bg-[#718B68] text-white rounded-br-md"
                  : "bg-white text-gray-800 shadow-sm rounded-bl-md border"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-white text-gray-400 shadow-sm rounded-bl-md border">
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1 p-2 border border-gray-200 rounded-full px-4 focus:outline-none focus:border-[#718B68] focus:ring-2 focus:ring-[#718B68] focus:ring-opacity-20 text-sm disabled:opacity-60"
          />
          <button
            onClick={sendMessage}
            disabled={sending}
            className="bg-[#718B68] text-white p-2 rounded-full hover:bg-[#5a7355] transition-colors duration-200 flex items-center justify-center min-w-[36px] disabled:opacity-60"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatbotBubble() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Container - Fixed dimensions with beautiful styling */}
      {open && (
        <div className="mb-4 animate-in slide-in-from-bottom-2 duration-300">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ width: "380px", height: "500px" }}
          >
            <Chatbot />
          </div>
        </div>
      )}

      {/* Chat Toggle Button - Enhanced design */}
      <button
        className="group relative bg-gradient-to-r from-[#718B68] to-[#5a7355] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        onClick={() => setOpen(!open)}
      >
        <div className="relative z-10 flex items-center justify-center w-6 h-6 transition-transform duration-300">
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="transition-transform duration-300"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-300"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          )}
        </div>

        {/* Pulse animation when closed */}
        {!open && (
          <div className="absolute inset-0 rounded-full bg-[#718B68] animate-ping opacity-20"></div>
        )}

        {/* Notification dot */}
        {!open && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
        )}
      </button>
    </div>
  );
}
