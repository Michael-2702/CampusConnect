import React from 'react'
import Left_sidebar from '../../Components/left_sidebar/Left_sidebar'
import Topbar from '../../Components/topbar/Topbar'
import Feed from '../../Components/feeds/Feed'
import Rightbar from '../../Components/right_bar/Rightbar'

function HomeScreen() {
  return (
    <div className='overflow-x-hidden'>
      
        <Topbar />

      
      <div className="mt-20  lg:flex lg:w-full md:hidden 2xl:flex xl:flex">
        <Left_sidebar />
      </div>
      <div className="absolute lg:ml-[21rem]">
        <Feed />
      </div>
    </div>
  )
}

export default HomeScreen
