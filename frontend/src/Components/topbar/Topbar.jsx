import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { NavLink } from "react-router-dom";

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality here
  };

  return (
    <div className="flex justify-between items-center sticky top-0 h-[65px] w-full dark:bg-slate-900 z-50">
      {/* Left - Logo */}
      <div className="flex-3">
        
        <span className="text-[39px] ml-6 font-bold text-white  cursor-pointer">
          <a href="home">CampusConnect</a>
        </span>
       
      </div>

      {/* Middle - Search Bar */}
      <div className="flex-5">
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
      </div>

      {/* Right - Profile Section */}
      <div className="topbarRight flex items-center">
        {/* You can dynamically render profile information here */}
        <img
          src="/assets/person/1.jpeg"
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover bg-white mr-6 cursor-pointer"
        />
      </div>
    </div>
  );
}