import React from 'react'
import Share from '../share/Share'
import Post from '../post/Post'
import { RecoilRoot } from 'recoil'


function Feed() {
  return (
    <div className="feed">
      <div className="w-[750px] ml-20 mx-auto my-0">
        <Share />
       
        <RecoilRoot>
          <Post />
        </RecoilRoot>
      </div>
    </div>
  )
}

export default Feed
