import React from 'react'
import { NavLink } from 'react-router-dom'

function Left_sidebar() {
  return (
    <div className="flex relative h-36 w-72  ">
      <div className="p-2  fixed  mt-5 ml-5">
        <ul className=" hi">
          <li className="flex items-center mb-5">
            <span className="text-xl cursor-pointer">Home</span>
          </li>
          <li className="mb-5">
            <span className="text-xl cursor-pointer">Profile</span>
          </li>
        </ul>
        <NavLink to = "/login">
        <button className="text-xl">Log out</button>
        </NavLink>
      </div>
    </div>
  )
}

export default Left_sidebar
