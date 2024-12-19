import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Left_sidebar() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3001/api/v2/admin/viewAdminInfo", {
          headers: {
            authorization: token,
          },
        });
        console.log(response.data);
        setUserProfile(response.data.adminInfo); // Set the user profile data
      } catch (err) {
        console.error("Error fetching profile data", err);
      }
    };

    fetchProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  const { name, adminId, userCount } = userProfile;

  return (
    <div className="fixed left-0 flex flex-col w-72 max-h-[32rem] ml-8 mt-8 p-5 bg-gray-200 m-3 shadow-2xl rounded-xl">
      <div className="profile-section p-5">
        <img
          className="w-[5rem] h-[5rem] rounded-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"
          alt="Profile"
        />
        <h2 className="text-2xl font-semibold mt-4">{name}</h2>
        <h4 className="text-xl font-semibold mt-4">Total users:  {userCount}</h4>
        {/* <NavLink to="/profile" className="mt-4 inline-block text-blue-500">
          View Profile
        </NavLink> */}
      </div>
    </div>
  );
}

export default Left_sidebar;