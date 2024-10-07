import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom"; 
import { NavLink } from 'react-router-dom';
import axios from "axios";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

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
    <div className="flex justify-between items-center sticky top-0 h-[65px] w-full bg-slate-900 z-50">
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
      <NavLink to="/profile" >
      <div className="flex items-center relative left-[29rem]">
        <img
          src={profileImagePath? `http://localhost:3000${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
          alt="Profile"
          className="w-11 h-11 rounded-full object-cover bg-white mr-4 cursor-pointer"
        />
      </div>
      </NavLink>
      <div>
        <button
          type="button"
          className="border-2 mr-6 text-white py-1 px-3 h-10 rounded-md focus:outline-none flex items-center hover:bg-slate-700 hover:pointer"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
