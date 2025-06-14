import axios from "axios";
import React, { useState } from "react";

interface User {
  _id: any;
  username: string;
  name: string;
}

const SearchBar: React.FC = () => {
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
          <div className="mt-4  bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              User Found:
            </h3>
            <p className="ml-5">
              <strong>Name:</strong> {foundUser.name}
            </p>
            <p className="ml-5">
              <strong>Username:</strong> {foundUser.username}
            </p>
          <button
                onClick={()=>alert("Under Developement")}
                className="bg-blue-600 text-white px-5 w-full mt-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                Add as friend
            </button>
          </div>
          
        )}
      </div>
    </div>
  );
};

export default SearchBar;
