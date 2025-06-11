import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

// Define the message type
interface Message {
  _id?: string;
  sender: {
    name: String;
    _id: String;
  };
  receiver: {
    name: String;
    _id: String;
  };
  content: string;
  sentAt?: string;
}

const Chat: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [activeWarning, setActiveWarning] = useState<boolean>(false);

  useEffect(() => {
    if (!user?._id || !user?.name) {
      navigate("/");
      return;
    }
    if (!socketRef.current) {
      socketRef.current = io(apiUrl);
    }
    const handleNewMessage = (msg: Message) => {
      console.log("This is the broadcast: ", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socketRef.current.on("activeUser", (count: number) => {
      setActiveUsers(count);
    });

    socketRef.current.on("newBroadcastMessage", handleNewMessage);

    return () => {
      // ✅ Clean up listeners
      socketRef.current?.off("newBroadcastMessage", handleNewMessage);
      socketRef.current?.off("activeUser");

      // ✅ Disconnect on unmount
      socketRef.current?.disconnect();
      socketRef.current = null; // Reset ref
    };
  }, []);

  const sendBroadcast = () => {
    if (!input.trim()) return;
    if (activeUsers == 1 && !activeWarning) {
      alert(
        "No one is listening to you buddy, still feel free to send messages"
      );
      setActiveWarning(true);
    }
    const messageData: Message = {
      sender: {
        name: user?.name,
        _id: user?._id,
      },
      receiver: {
        name: "",
        _id: "",
      },
      content: input,
    };

    socketRef.current?.emit("broadcastMessage", messageData);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2 className="text-center text-4xl">Global Chat</h2>
      <p className="text-center mt-4 text-lg font-mono font-bold">{`Active users: ${
        activeUsers == 1 ? "Only you" : activeUsers
      }`}</p>
      <div
        style={{
          border: "1px solid #ddd",
          height: 300,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((message) => {
          const date = message.sentAt
            ? new Date(message.sentAt).toLocaleTimeString()
            : null;
          return (
            <div
              className={`flex flex-col bg-blue-300 rounded-xl  gap-2 p-3 my-2`}
              key={message._id}
            >
              <p className="text-md text-gray-700 font-bold">
                {message.sender.name}
              </p>
              <div className="flex justify-between">
                <p>{message.content}</p>
                <p>{date}</p>
              </div>
            </div>
          );
        })}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendBroadcast();
        }}
        placeholder="Type a message"
        className="border-2 border-black"
        style={{ width: "100%", padding: 8 }}
      />
      <button
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
        onClick={sendBroadcast}
        style={{ marginTop: 8, width: "100%" }}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
