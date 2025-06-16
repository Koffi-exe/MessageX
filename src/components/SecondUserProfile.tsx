import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface User {
  _id: string;
  name: string;
}

const SecondUserProfile: React.FC = () => {
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const [user, setUser] = useState<User>();
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [alreadyFriends, setAlreadyFriends] = useState<boolean>(false);

  const sendRequest = async () => {
    try {
      const response = await axios.post(`${apiUrl}/request/send`, {
        receiverId: id,
        senderId: loggedUser._id,
      });
      console.log("Friend request sent:", response.data);
      setRequestSent(true);
    } catch (error: any) {
      if (
        error.response?.data?.message === "Friend request already sent"
      ) {
        setRequestSent(true);
      } else if (
        error.response?.data?.message === "You are already friends"
      ) {
        setAlreadyFriends(true);
      } else {
        console.error("Error sending friend request:", error);
      }
    }
  };

  useEffect(() => {
    const findUserDetail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/search/${id}`);
        setUser(response.data?.foundUser);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const checkIfRequestSent = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/request/status?senderId=${loggedUser._id}&receiverId=${id}`
        );
        if (response.data?.alreadySent) {
          setRequestSent(true);
        } else if (response.data?.alreadyFriends) {
          setAlreadyFriends(true);
        }
      } catch (error) {
        console.error("Error checking request status:", error);
      }
    };

    findUserDetail();
    checkIfRequestSent();
  }, [apiUrl, id, loggedUser._id]);

  const renderButton = () => {
    if (alreadyFriends) {
      return (
        <button
          disabled
          className="w-full bg-green-500 text-white px-5 py-2 rounded-lg font-medium cursor-not-allowed"
        >
          Already Friends
        </button>
      );
    }
    if (requestSent) {
      return (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-600 px-5 py-2 rounded-lg font-medium cursor-not-allowed"
        >
          Request Already Sent
        </button>
      );
    }
    return (
      <button
        onClick={sendRequest}
        className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
      >
        Send Friend Request
      </button>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {user?.name}
        </h2>
        <p className="text-gray-500 mb-6">@{user?._id}</p>
        {renderButton()}
      </div>
    </div>
  );
};

export default SecondUserProfile;
