import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Left_sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("authorization");
    
    // Navigate to the login page
    navigate('/login');
  }

  return (
    <div className="flex relative h-36 w-72">
      <div className="p-2 fixed mt-5 ml-5">
        <ul className="hi">
          <li className="flex items-center mb-5">
            <span className="text-xl cursor-pointer">Home</span>
          </li>
          <li className="mb-5">
            <span className="text-xl cursor-pointer">Profile</span>
          </li>
        </ul>
        <button className="text-xl" onClick={handleLogout}>Log out</button>
      </div>
    </div>
  )
}

export default Left_sidebar