import React from 'react'
import Share from '../share/Share'
import Post from '../post/Post'
import './feedStyle.css';


function Feed() {
  return (
    <div className="feed">
      <div className="feedWrapper">
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
