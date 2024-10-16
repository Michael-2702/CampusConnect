import React from 'react'
import Left_sidebar from '../../Components/left_sidebar/Left_sidebar'
import Topbar from '../../Components/topbar/Topbar'
import Feed from '../../Components/feeds/Feed'
import Rightbar from '../../Components/right_bar/Rightbar'

function HomeScreen() {
  return (
    <div>
      <Topbar />
      <div className="lg:flex lg:w-full md:hidden">
        <Left_sidebar />
      </div>
      <div className="lg:ml-[21rem] md:ml-[-1rem]">
        <Feed />
      </div>
    </div>
  )
}

export default HomeScreen
