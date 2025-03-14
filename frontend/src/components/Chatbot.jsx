import { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { useSendMessageMutation } from "../redux/api/chat.js"
import Loader2 from "./Loader2.jsx";

const MESSAGE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const Chatbot = () => {
  const messageStart = "Hello! How can I help you today?";
  const [messages, setMessages] = useState([
    { role: "assistant", content: messageStart }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const res = await sendMessage({ message: input }).unwrap();
      const data = res.response;
      setMessages((prev) => [...prev, { role: "assistant", content: data }]);
    } catch (error) {
      console.error("Chatbot error:", error);
    }
    setInput(""); // Clear input after sending
  };

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem("chatMessages");
    const timestamp = localStorage.getItem("chatTimestamp");

    if (storedData && timestamp) {
      const timeElapsed = Date.now() - parseInt(timestamp, 10);

      if (timeElapsed < MESSAGE_EXPIRY_TIME) {
        const decryptedMessages = JSON.parse(decodeURIComponent(storedData));
        setMessages(decryptedMessages);
      } else {
        // Clear old messages if time has expired
        localStorage.removeItem("chatMessages");
        localStorage.removeItem("chatTimestamp");
      }
    }
  }, []);

   // Save messages to localStorage whenever they update
   useEffect(() => {
    if (messages.length > 0) {
      const limitedMessages = messages.slice(-50); // Keep last 50 messages
      const encryptedMessages = encodeURIComponent(JSON.stringify(limitedMessages));

      localStorage.setItem("chatMessages", encryptedMessages);
      localStorage.setItem("chatTimestamp", Date.now().toString()); // Save current timestamp
    }
  }, [messages]);

  useEffect(() => {
    // Scroll to the bottom of the messages list
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Focus on the input field
    inputRef.current?.focus();
  }, [messages]);


  // Function to clear chat (optional)
  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
    setMessages([{ role: "assistant", content: messageStart }]);
  };
  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 cursor-pointer bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        💬
      </button>

      {/* Chatbot Window */}
      {isLoading && <Loader2 />}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white dark:bg-gray-900 shadow-xl rounded-xl flex flex-col border border-gray-300 dark:border-gray-700 animate-slide-up">
          <div className="p-4 text-lg font-semibold bg-blue-500 text-white flex justify-between items-center rounded-t-xl">
            <span>Your Assistant</span>
            <button onClick={handleClearChat} className="text-white text-sm cursor-pointer bg-red-500 px-2 py-1 rounded-lg hover:bg-red-600">
              Clear Chat
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-grow p-4 overflow-y-auto h-64 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-4 py-2 text-sm rounded-lg shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white self-end ml-auto rounded-tr-md rounded-tl-md rounded-bl-md"
                    : "bg-gray-200 text-gray-900 self-start mr-auto rounded-tr-md rounded-tl-md rounded-br-md"
                }`}
              >
                <Markdown>{msg.content}</Markdown>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-3 border-t border-gray-300 dark:border-gray-700 flex items-center">
            <input
              type="text"
              value={input}
              ref={inputRef}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-full bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              disabled={isLoading}
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 text-white cursor-pointer p-2 rounded-full hover:bg-blue-600 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
)
}

export default Chatbot