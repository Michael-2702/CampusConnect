import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Left_sidebar() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3001/api/v2/user/viewProfile", {
          headers: {
            authorization: token,
          },
        });
        setUserProfile(response.data.userInfo);
      } catch (err) {
        console.error("Error fetching profile data", err);
      }
    };

    fetchProfile();
  }, []);

  if (!userProfile) {
    return (
      <div className="hidden md:flex fixed left-0 items-center justify-center w-72 h-[32rem] ml-8 mt-8 bg-white shadow-lg rounded-xl">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const { profileImagePath, name, username, bio, department } = userProfile;

  return (
    <div className="fixed left-0 w-72 max-h-[32rem] ml-8 mt-8 bg-white shadow-lg rounded-xl overflow-hidden sm:hidden 2xl:inline xl:inline">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24"></div>
      <div className="px-6 py-4 relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <NavLink to="/profile" className="inline-block">
            <img
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
              src={profileImagePath ? `http://localhost:3001${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"}
              alt="Profile"
            />
          </NavLink>
        </div>
        <div className="text-center mt-14">
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <h3 className="text-sm text-gray-500 mb-2">@{username}</h3>
          <p className="text-sm text-gray-600 mb-4">{bio || "No bio available"}</p>
          <div className="rounded-lg p-3 mb-4">
            <p className="text-sm">Department: <span className="font-semibold">{department}</span></p>
          </div>
          <NavLink 
            to="/profile" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            View Profile
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Left_sidebar;
