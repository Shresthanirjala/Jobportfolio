import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config/config";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", text: input }]);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/chatbot/chat`, {
        message: input,
      });

      // Add bot reply to chat
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error contacting chatbot." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            {m.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me something..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
