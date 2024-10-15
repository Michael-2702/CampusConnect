import React from 'react'
import Admin_Left_sidebar from '../../Components/left_sidebar/Admin_left_sidebar'
import AdminTopbar from '../../Components/topbar/AdminTopbar'
import AdminFeed from '../../Components/feeds/AdminFeed'
import { NavLink } from 'react-router-dom'
// import adminReportedPosts from '../../Components/post/AdminReportedPosts'
 

function AdminHomeScreen() {
  return (
    <div>
       <>
      <AdminTopbar />
      <div className="flex w-full">
        <Admin_Left_sidebar/>
        
      </div>
      <div className="ml-[21rem]">
        <AdminFeed/>
      </div>
      <div>
        <NavLink to="/viewAllUsers">
          <button
              className="border-none p-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600  font-bold mr-5 cursor-pointer text-white fixed right-5 top-20 z-50  focus:outline-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              style={{ zIndex: 50 }}
            >
              View All Users
            </button>
        </NavLink>
      </div>
      <div>
        <NavLink to="/reportedPosts">
          <button
              className="border-none p-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 font-bold mr-5 cursor-pointer text-white hover:bg-blue-700 fixed right-5 top-[8rem] z-50  focus:outline-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              style={{ zIndex: 50 }}
            >
              View reported Posts
            </button>
        </NavLink>
      </div>
      
    </>
    </div>
  )
}

export default AdminHomeScreen
