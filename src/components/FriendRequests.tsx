import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  username?: string;
}

const FriendRequests: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptRequestMarker, setAcceptRequestMarker] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${apiUrl}/request/${loggedUser._id}/requests`);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async(receiverId:string, senderId:string)=>{
    console.log(`This is my id: ${receiverId}, This is the senderID:${senderId}`)

    try {
        await axios.post(`${apiUrl}/request/accept`, {receiverId, senderId})
        setAcceptRequestMarker((prev)=>!prev)
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    fetchRequests();
  }, [acceptRequestMarker]);

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Friend Requests</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No friend requests found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm"
            >
              <div>
                <p className="text-lg font-semibold text-gray-700">{user.name}</p>
                {user.username && (
                  <p className="text-sm text-gray-500">@{user.username}</p>
                )}
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                onClick={()=>acceptRequest(loggedUser._id, user._id)}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
