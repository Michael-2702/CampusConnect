import { useState, useEffect } from "react";
import axios from "axios";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/post/viewPosts", {
          headers: {
            authorization: token,
          },
        });
        setPosts(response.data); // Ensure the response data is set directly
      } catch (err) {
        console.error("Error fetching posts data", err);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array to ensure the effect runs once

  const likeHandler = (postId) => {
    setPosts(posts.map(post => 
      post._id === postId 
        ? {
            ...post,
            likes: post.likes.includes(localStorage.getItem("userId"))
              ? post.likes.filter(id => id !== localStorage.getItem("userId"))
              : [...post.likes, localStorage.getItem("userId")],
          }
        : post
    ));
    // You would make an API call here to update the like on the server
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="w-[800px] rounded-xl shadow-2xl m-5">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="w-8 h-8 rounded-full object-cover border-2"
                  src="https://via.placeholder.com/150" // Default profile picture
                  alt="Profile"
                />
                <span className="size-4 text-black font-medium my-2 ml-1 pb-2">
                  {post.username}
                </span>
              </div>
            </div>
            <div className="m-5">
              <span className="postText">{post.text}</span>
              {post.postsImagePath && (
                <img
                  className="mt-5 w-full max-h-[400px] object-contain"
                  src={`http://localhost:3000${post.postsImagePath}`} // Make sure path is correct
                  alt="Post content"
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex">
                <img
                  className="w-6 h-6 ml-5 mr-2 cursor-pointer"
                  src="/public/hand-thumb.png"
                  onClick={() => likeHandler(post._id)}
                  alt="Like button"
                />
                <span className="size-4">{post.likes.length}</span>
              </div>
              {/* <div className="postBottomRight">
                <span className="cursor-pointer size-4">
                  {post.comments ? post.comments.length : 0} comments
                </span>
              </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
