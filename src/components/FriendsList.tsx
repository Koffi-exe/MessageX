import axios from "axios";
import { useEffect, useState } from "react";
import { MdPerson } from "react-icons/md";
import { useNavigate } from "react-router-dom";

type Friend = {
  _id: string;
  name: string;
  username?: string;
};

const FriendsList = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const userId = loggedUser._id;
  const apiUrl = import.meta.env.VITE_API_URL;

  const [friends, setFriends] = useState<Friend[]>([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async (id: string) => {
      try {
        const response = await axios.get(`${apiUrl}/friend/${id}/list`);
        if (response.status !== 200) {
          return setError("Unable to fetch friends");
        }
        setFriends(response.data.friends);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("An error occurred while fetching friends.");
      }
    };

    if (userId) fetchFriends(userId);
    else setError("No user ID found.");
  }, []);

  const handleSendMessage = (friendId: string) => {
    navigate(`/privatemessage/${friendId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-4xl mx-auto text-center pt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Friends</h1>
        <p className="text-lg text-gray-600">Connect and chat with your friends instantly</p>
      </div>

      <div className="max-w-3xl mx-auto mt-12">
        {error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : friends.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MdPerson className="text-blue-600 text-3xl" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{friend.name}</p>
                    {friend.username && (
                      <p className="text-sm text-gray-500">@{friend.username}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleSendMessage(friend._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Message
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-8">
            You don&apos;t have any friends yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
