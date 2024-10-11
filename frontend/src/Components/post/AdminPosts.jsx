import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import axios from "axios";

const AdminPost = React.memo(() => {
  const [posts, setPosts] = useState([]);
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState({}); // Track which post's menu is shown

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/post/viewPosts", {
          headers: {
            authorization: token,
          },
        });

        console.log("Fetched Posts:", response.data);
        setPosts(response.data);

      } catch (err) {
        console.error("Error fetching posts data", err);

      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures it runs once after mount

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const toggleMenu = (postId) => {
    setShowMenu((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle the menu visibility for the clicked post
    }));
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem("authorization");
      await axios.delete(`http://localhost:3000/api/v1/admin/deletePost/${postId}`, {
        headers: {
          authorization: token,
        },
      });

      // Remove the deleted post from the local state
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post", err);
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="w-[800px] rounded-xl shadow-2xl m-5">
          <div className="p-2 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="w-12 h-12 ml-4 mt-4 rounded-full object-cover border-2"
                  src={post.userImagePath ? `http://localhost:3000${post.userImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
                  alt="Profile"
                />
                <NavLink to={`/adminViewProfile/${post.postedBy}`} className="mt-4 inline-block text-blue-500">
                  <span className="size-4 text-black font-medium my-2 mt-5 ml-3 pb-2">
                    {post.username}
                  </span>
                </NavLink>
              </div>

              {/* 3-dot menu */}
              <div className="relative mr-8">
                <button
                  className="text-black  hover:text-gray-800 focus:outline-none"
                  onClick={() => toggleMenu(post._id)}
                  style={{ fontSize: '24px', width: '40px', height: '40px' }}
                >
                &#8942;{/* 3-dot icon */}
                </button>
                
                {showMenu[post._id] && (
                  <div className="absolute top-0 right-0 mt-8 bg-white border rounded shadow-md z-10">
                    <button
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                      onClick={() => deletePost(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <hr className="m-5 border-gray-500" />
            <div className="postText ml-6 max-w-[800px]">{post.text}</div>
            <div className="m-5 flex justify-center">
              {post.postsImagePath && (
                <img
                  className="mt-5 max-h-[500px] w-auto object-fit:contain"
                  src={`http://localhost:3000${post.postsImagePath}`} 
                  alt="Post content"
                />
              )}
            </div>
            <div className="flex">
              <img
                className="w-6 h-6 ml-5 mr-2 cursor-pointer"
                src="public\hand-thumb.png"
                onClick={likeHandler}
                alt="Like button"
              />
              <span className="size-4">{like}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default AdminPost;