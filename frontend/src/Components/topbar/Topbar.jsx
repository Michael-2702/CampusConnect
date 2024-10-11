import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { NavLink } from 'react-router-dom';
import axios from "axios";

export default function Topbar() {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
      } catch (err) {
        console.error("Error fetching profile data", err);
      }
    };

    fetchProfile();
  }, []);

  if (!userProfile) {
    return <div className="h-[65px] bg-slate-900 flex items-center justify-center text-white font-semibold animate-pulse">Loading...</div>;
  }

  const { profileImagePath } = userProfile;

  const handleLogout = () => {
    localStorage.removeItem("authorization");
    navigate("/Login");
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="flex justify-between items-center sticky top-0 h-[65px] w-full bg-slate-900 z-50 px-6 shadow-md transition-all duration-300 ease-in-out">
      {/* Left - Logo */}
      <div className="flex-3">
        <span className="text-[39px] font-bold text-white cursor-pointer transition-all duration-300 hover:text-blue-400">
          <a href="/home" onClick={handleLogoClick} className="no-underline text-inherit">
            CampusConnect
          </a>
        </span>
      </div>

      {/* Right - Profile Section and Logout */}
      <div className="flex items-center space-x-6">
        <NavLink to="/profile" className="group">
          <div className="relative overflow-hidden rounded-full">
            <img
              src={profileImagePath ? `http://localhost:3000${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover bg-white cursor-pointer transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-25"></div>
          </div>
        </NavLink>
        <button
          type="button"
          className="bg-transparent border-2 border-white text-white py-1 px-4 h-10 rounded-md focus:outline-none flex items-center transition-all duration-300 hover:bg-white hover:text-slate-900 hover:border-transparent active:scale-95"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}