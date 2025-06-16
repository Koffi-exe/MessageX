import axios from "axios";
import { useEffect, useState } from "react";
import { MdPerson } from "react-icons/md";

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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-4xl font-bold mb-6">Your Friends</h1>
        <p className="text-lg mb-8">
          Connect and chat with your friends instantly
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        {error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : friends.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="bg-white shadow-md p-6 rounded-xl text-lg font-medium flex items-center gap-3"
              >
                <MdPerson className="text-blue-600 text-2xl" />
                {friend.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            You don&apos;t have any friends yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
