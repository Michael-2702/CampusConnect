import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation after logout
import axios from "axios";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/user/viewProfile", {
          headers: {
            authorization: token,
          },
        });
        setUserProfile(response.data.userInfo); // Set the user profile data
      } catch (err) {
        console.error("Error fetching profile data", err);
      }
    };

    fetchProfile();
  }, []);

  // Handle loading state
  if (!userProfile) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  const { profileImagePath } = userProfile;

  const handleLogout = () => {
    // Remove authorization token from localStorage
    localStorage.removeItem("authorization");
    navigate("/Login"); // Programmatically navigate to the Login page after logout
  };

  return (
    <div className="flex justify-between items-center sticky top-0 h-[65px] w-full dark:bg-slate-900 z-50">
      {/* Left - Logo */}
      <div className="flex-3">
        <span className="text-[39px] ml-6 font-bold text-white cursor-pointer">
          <a href="home">CampusConnect</a>
        </span>
      </div>

      {/* Middle - Search Bar */}
      {/* <div className="flex-5">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center w-[700px] h-8 bg-white rounded-3xl">
            <CiSearch className="text-[20px] ml-3" />
            <input
              placeholder="Search for friend post"
              className="w-[80%] text-[20px] ml-3 outline-none"
              value={searchQuery}
              onChange={handleSearchInput}
            />
          </div>
        </form>
      </div> */}

      {/* Right - Profile Section */}
      <div className="flex items-center">
        <img
          src={`http://localhost:3000${profileImagePath}`}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover bg-white mr-4 cursor-pointer"
        />
        <button
          type="button"
          className="border-2 mr-6 text-white py-1 px-2 h-8 rounded-md focus:outline-none flex items-center"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
