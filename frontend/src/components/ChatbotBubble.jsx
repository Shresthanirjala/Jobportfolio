import { useState } from "react";
import Chatbot from "./chatbot";


export default function ChatbotBubble() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-2">
          <Chatbot />
        </div>
      )}

      <button
        className="bg-[#718B68] text-white p-4 rounded-full shadow-lg hover:bg-opacity-90"
        onClick={() => setOpen(!open)}
      >
        {open ? "✖" : "💬"}
      </button>
    </div>
  );
}
