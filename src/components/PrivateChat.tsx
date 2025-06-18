import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface Message {
  _id?: string;
  sender: {
    _id: string;
    name: string;
  };
  receiver?: {
    _id: string;
    name: string;
  };
  content: string;
  sentAt: Date;
}

const PrivateChat: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const navigate = useNavigate();
  const { receiverId, name} = useParams();
  const senderId = loggedUser._id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loggedUser || !loggedUser.name) {
      navigate("/");
      return;
    }
    if (!socketRef.current) {
      socketRef.current = io(apiUrl);
    }

    const fetchMessage = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/private/message/get/${receiverId}/${senderId}`
        );
        const rawMessages = response.data?.existingMessage || [];

        const messages = rawMessages.map((msg: any) => ({
          ...msg,
          sentAt: new Date(msg.sentAt),
        }));

        setMessages(messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessage();

    const socket = socketRef.current;
    socket.emit("registerUser", { userId: senderId });

    socket.on("newPrivateMessage", (data: Message) => {
      const parsedMessage = {
        ...data,
        sentAt: new Date(data.sentAt),
      };
      setMessages((prev) => [...prev, parsedMessage]);
    });
  }, []);

  const handleSend = () => {
    if (!receiverId || !content.trim()) return;

    const socket = socketRef.current;

    socket?.emit("privateMessage", {
      senderId,
      receiverId,
      content,
    });

    setContent("");
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-xl mx-auto border shadow rounded-md bg-white scrollbar-hide">
      <div className="p-4 border-b text-lg font-semibold bg-blue-600 text-white rounded-t-md">
        {name}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender._id === senderId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg shadow ${
                msg.sender._id === senderId
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {msg.sender?._id === senderId ? "You" : msg.sender.name}
              </div>
              <div className="break-words">{msg.content}</div>
              <div className="text-[10px] text-right mt-1 opacity-80">
                {msg.sentAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="p-3 border-t flex items-center gap-2 bg-white">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring focus:ring-blue-300"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default PrivateChat;
