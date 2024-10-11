import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { User, Briefcase, Users } from 'lucide-react';

function LeftSidebar() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/user/viewProfile", {
          headers: {
            authorization: token,
          },
        });
        setUserProfile(response.data.userInfo);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data", err);
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse"> {/* Adjusted padding */}
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div> {/* Adjusted size */}
        <div className="h-5 bg-gray-300 rounded w-2/3 mx-auto mb-2"></div> {/* Adjusted size */}
        <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div> {/* Adjusted size */}
        <div className="h-16 bg-gray-300 rounded w-full mb-4"></div> {/* Adjusted size */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-4"> {/* Adjusted padding */}
        <p className="text-red-500 text-center font-medium">{error}</p>
      </div>
    );
  }

  const { profileImagePath, name, username, bio, department, friends } = userProfile;

  return (
    <div className="fixed left-0 w-72 h-screen p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 transition-all duration-300 ease-in-out hover:shadow-xl"> {/* Adjusted padding */}
        <div className="profile-section mb-4 text-center"> {/* Adjusted margin */}
          <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full ring-2 ring-blue-500 ring-offset-2"> {/* Adjusted size */}
            <img
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              src={profileImagePath ? `http://localhost:3000${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"}
              alt="Profile"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2> {/* Adjusted font size */}
          <h3 className="text-sm text-gray-600 mb-2">@{username}</h3> {/* Adjusted margin */}
          <p className="text-sm text-gray-700 mb-2 italic bg-gray-100 p-1 rounded-md">{bio || "No bio available"}</p> {/* Adjusted padding and margin */}
          <div className="flex justify-center space-x-4 text-sm text-gray-700 mb-4"> {/* Adjusted space */}
            <div className="flex flex-col items-center">
              <Briefcase className="mb-1 text-blue-500" size={18} />
              <span className="font-medium">{department}</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="mb-1 text-blue-500" size={18} />
              <span className="font-medium">{friends?.length || 0} Friends</span>
            </div>
          </div>
          <NavLink 
            to="/profile" 
            className="flex items-center justify-center w-full p-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200 font-semibold"
          >
            <User className="mr-1" size={20} /> View Profile
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
