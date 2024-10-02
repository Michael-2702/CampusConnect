import React from 'react'
import Left_sidebar from '../../Components/left_sidebar/Left_sidebar'
import Topbar from '../../Components/topbar/Topbar'
import Feed from '../../Components/feeds/Feed'
import Rightbar from '../../Components/right_bar/Rightbar'
 

function HomeScreen() {
  return (
    <div>
       <>
      <Topbar />
      <div className="flex w-full">
        <Left_sidebar />
        <Feed/>
        <Rightbar/>
      </div>
    </>
    </div>
  )
}

export default HomeScreen
