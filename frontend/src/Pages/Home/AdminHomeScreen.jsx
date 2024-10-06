import React from 'react'
import Admin_Left_sidebar from '../../Components/left_sidebar/Admin_left_sidebar'
import AdminTopbar from '../../Components/topbar/AdminTopbar'
import AdminFeed from '../../Components/feeds/AdminFeed'

 

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
      
    </>
    </div>
  )
}

export default AdminHomeScreen
