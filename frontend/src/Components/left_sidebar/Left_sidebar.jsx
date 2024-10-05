import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Left_sidebar() {
  const [userProfile, setUserProfile] = useState(null);

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

  if (!userProfile) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  const { profileImagePath, name, username, bio, department, friends } = userProfile;

  return (
    <div className="flex flex-col w-72 h-[22rem] ml-8 mt-8 p-5 bg-gray-200 m-3 shadow-2xl rounded-xl">
      <div className="profile-section p-5">
        <img
          className="w-[5rem] h-[5rem] rounded-full object-cover"
          src={`http://localhost:3000${profileImagePath}`}
          alt="Profile"
        />
        <h2 className="text-2xl font-semibold mt-4">{name}</h2>
        <h3 className="text-md text-gray-500">@{username}</h3>
        <p className="text-md text-gray-700 mt-2">{bio || "No bio available"}</p>
        <p className="text-md text-gray-700 mt-2">Department: {department}</p>
        <p className="text-md text-gray-700 mt-2">Total Friends: {friends.length}</p>
        
        <NavLink to="/profile" className="mt-4 inline-block text-blue-500">
          View Profile
        </NavLink>
      </div>
    </div>
  );
}

export default Left_sidebar;
