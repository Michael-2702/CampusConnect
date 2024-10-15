import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom"; 
import { NavLink } from 'react-router-dom';
// import axios from "axios";

function AdminTopbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("authorization");
//         const response = await axios.get("http://localhost:3000/api/v1/admin/viewAdminInfo", {
//           headers: {
//             authorization: token,
//           },
//         });
//         setUserProfile(response.data.userInfo); // Set the user profile data
//       } catch (err) {
//         console.error("Error fetching profile data", err);
//       }
//     };

//     fetchProfile();
//   }, []);

  // Handle loading state
//   if (!userProfile) {
//     return <div>Loading...</div>; // Show a loading message while data is being fetched
//   }

//   const { profileImagePath } = userProfile;

  const handleLogout = () => {
    // Remove authorization token from localStorage
    localStorage.removeItem("authorization");
    navigate("/admin"); // Programmatically navigate to the Login page after logout
  };

  return (
    <div className="flex justify-between items-center sticky top-0 h-[65px] w-full bg-blue-500 z-50">
      {/* Left - Logo */}
      <div className="flex-3">
        <span className="text-[39px] ml-6 font-bold text-white cursor-pointer">
          <a href="adminHome">CampusConnect</a>
        </span>
      </div>

      <div className="flex items-center relative left-[29rem]">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s" 
          alt="Profile"
          className="w-11 h-11 rounded-full object-cover bg-white mr-4 cursor-pointer"
        />
      </div>

      <div>
        <button
          type="button"
          className="bg-transparent relative right-4 border-2 border-white text-white py-1 px-4 h-10 rounded-md focus:outline-none flex items-center transition-all duration-300 hover:bg-white hover:text-slate-900 hover:border-transparent active:scale-95"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
export default AdminTopbar;