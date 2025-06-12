import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

type PrivateRoomProps = {
  roomId: string;
};

interface Message {
  sender: {
    name: string;
    _id: string;
  };
  content: string;
}

const PrivateRoom: React.FC<PrivateRoomProps> = ({ roomId }) => {
  const navigate = useNavigate();
  const [roomError, setRoomError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const socketRef = useRef<Socket | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user || !user.name) {
      navigate("/");
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io(apiUrl);
    }

    const socket = socketRef.current;

    socket.emit("joinRoom", { roomId, userName: user.name });

    socket.on("roomActiveUsers", (data) => {
      console.log("THIS IS USERS IN ROOM::", data);
      setActiveUsers(data);
    });

    socket.on("ERROR", (err: string) => {
      setRoomError(err);
      alert(err);
    });

    socket.on("newRoomMessage", (msg: Message) => {
      console.log("New private room message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("ERROR");
      socket.off("newRoomMessage");
      socket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!messageText.trim()) return;

    socketRef.current?.emit("roomMessage", {
      roomId,
      sender: {
        name: user.name,
        _id: user._id,
      },
      content: messageText,
    });

    setMessageText("");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-xl mx-auto p-4 border rounded shadow-md bg-white space-y-4">
        <h2 className="text-xl text-center font-bold">Room: {roomId}</h2>

        <div className="h-80 overflow-y-auto border rounded p-2 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2 bg-blue-300 p-3 my-2 rounded-xl gap-2">
              <div>
                <p className="font-bold">{msg.sender.name}</p>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-grow bg-slate-200 border rounded p-2"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>

        {roomError && (
          <div className="text-red-600 font-medium mt-2">{roomError}</div>
        )}
      </div>
      <div className="items-center flex flex-col w-full max-w-xl mx-auto p-4 border rounded shadow-md bg-white space-y-4">
        <div className="flex flex-col text-2xl font-bold">Active Users:</div>
        {activeUsers.map((user)=>(
          <div key={user} className="text-xl font-medium">{user}</div>
        ))}
      </div>
    </div>
  );
};

export default PrivateRoom;
