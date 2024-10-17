import React from 'react'
import Share from '../share/Share'
import Post from '../post/Post'


function Feed() {
  return (
    <div className="feed">
      <div className="w-[750px] ml-20 mx-auto my-0">
        <Share />
        {/* {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))} */}
        <Post />
        
      </div>
    </div>
  )
}

export default Feed
