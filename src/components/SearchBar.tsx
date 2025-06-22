import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AllUsers from "./AllUsers";

interface User {
  _id: any;
  username: string;
  name: string;
}

const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchError, setSearchError] = useState<string>("");
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setSearchError("");
    setFoundUser(null);

    try {
      const response = await axios.post(`${apiUrl}/search/username`, {
        username: trimmedQuery,
      });

      const searchResult = response.data.foundUser;
      if (searchResult && searchResult._id) {
        setFoundUser(searchResult);
        console.log(searchResult);
      } else {
        setSearchError("User not found.");
      }
    } catch (error: any) {
      setSearchError(
        error?.response?.data?.message || "An error occurred while searching."
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full py-6 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <label className="text-sm font-semibold text-gray-700">
          Search by Username
        </label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. johndoe123"
          className="p-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Search
        </button>
      </form>

      <div className="w-full max-w-md mt-4">
        {searchError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow text-center">
            {searchError}
          </div>
        )}

        {foundUser && (
          <div className="my-10 flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                {foundUser.name}
              </h1>
              <p className="text-gray-500 mb-6">@{foundUser.username}</p>
              <button
                onClick={() => {
                  navigate(
                    `/user-profile/${foundUser._id}/${foundUser.name}/${foundUser.username}`
                  );
                }}
                className="w-full bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                Profile
              </button>
            </div>
          </div>
        )}
      </div>
      <h1 className="text-center text-xl font-bold ">All users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 mt-3">
        <AllUsers/>
      </div>
    </div>
  );
};

export default SearchBar;
