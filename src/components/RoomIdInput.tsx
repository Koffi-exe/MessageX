import React, { useState } from "react";

const RoomIdInput = () => {
  const [inputId, setInputId] = useState("");
  const [roomId, setRoomId] = useState("");
  return (
    <>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={inputId}
        onChange={(e) => setInputId(e.target.value)}
        className="mb-4 p-2  border rounded w-full max-w-xs"
      />
      <button
        className="px-4 py-2 text-white ml-0 md:ml-3 mt-2 md:mt-0 rounded bg-blue-600 hover:bg-blue-700 transition"
        onClick={() => setRoomId(inputId)}
      >
        Create Room
      </button>
    </>
  );
};

export default RoomIdInput;
