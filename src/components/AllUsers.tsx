import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdPerson } from "react-icons/md";

interface Friend {
  _id: string;
  name: string;
}
interface friendRequestsReceived {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  username: string;
  friends: Friend[];
  friendRequestsReceived: friendRequestsReceived[];
}

const AllUsers: React.FC = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const { token } = loggedUser;
  const apiUrl = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState<User[]>([]);
  const [update, setUpdate] = useState<boolean>(true)

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users/get/${token}`);
        const responseUsers = response.data.users.map((user: User) => ({
          ...user,
          friends: user.friends ?? [],
          friendRequests: user.friendRequestsReceived ?? [],
        }));
        setUsers(responseUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUser();
  }, [update]);

  //   useEffect(() => {
  //     console.log("Updated State of users", users);
  //   }, [users]);

  const sendRequest = async (receiverId:string)=>{
    try {
        const response = await axios.post(`${apiUrl}/request/send`, {
            receiverId,
            senderId: loggedUser._id
        })
        setUpdate((prev)=>!prev)
        console.log(response)
    } catch (error) {
        console.log(error)
    }
  }

  const renderButton = (friends: Friend[], requests: any, receiverId:string) => {
    const friendsId = Array.isArray(friends)
      ? friends.map((friend) => friend._id)
      : [];
    const requestsId = Array.isArray(requests)
      ? requests.map((request) => request)
      : [];

    if (friendsId.includes(loggedUser._id)) {
      return (
        <button className="bg-green-400 text-white rounded-xl p-2 cursor-not-allowed w-2/3">
          Already Friends
        </button>
      );
    } else if (requestsId.includes(loggedUser._id)) {
      return (
        <button className="bg-gray-400 text-gray-800 rounded-xl p-2 cursor-not-allowed w-2/3">
          Request sent
        </button>
      );
    } else {
      return (
        <button 
        onClick={()=> sendRequest(receiverId)}
        className="bg-blue-700 text-white rounded-xl p-2 hover:bg-blue-400 w-2/3">
          Send Request
        </button>
      );
    }
  };

  return (
    <>
      {users
        .filter((user) => user._id != loggedUser._id)
        .map((user) => {
          return (
            <div
              key={user._id}
              className="flex justify-around items-center bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center"
            >
              <MdPerson className="text-blue-600 text-3xl" />
              <div className="w-full">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {user?.name}
                </h2>
                <p className="text-gray-500 mb-6">@{user?.username}</p>
                {renderButton(user.friends, user.friendRequestsReceived, user._id)}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default AllUsers;
