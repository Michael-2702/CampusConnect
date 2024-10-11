import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Heart, MessageCircle, MoreVertical } from 'lucide-react';

const PostList = React.memo(() => {
  const [posts, setPosts] = useState([]);
  const [showMenu, setShowMenu] = useState({});
  const [showComments, setShowComments] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/post/viewPosts", {
          headers: { authorization: token },
        });
        setPosts(response.data);
        
        const userResponse = await axios.get("http://localhost:3000/api/v1/user/viewProfile", {
          headers: { authorization: token },
        });
        setCurrentUserId(userResponse.data.userInfo._id);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchPosts();
  }, []);

  const handleProfileClick = (postUserId) => {
    if (currentUserId === postUserId) {
      navigate('/profile');
    } else {
      navigate(`/viewOtherProfile/${postUserId}`);
    }
  };

  const toggleMenu = (postId) => {
    setShowMenu((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("authorization");
      await axios.put(
        `http://localhost:3000/api/v1/post/likePost/${postId}`,
        {},
        { headers: { authorization: token } }
      );
      
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId 
          ? { ...post, likes: [...post.likes, currentUserId] }
          : post
      ));
    } catch (err) {
      console.error("Error liking post", err);
    }
  };

  const handleReportToggle = async (postId, isReported) => {
    try {
      const token = localStorage.getItem("authorization");
      const endpoint = isReported ? 'unReportPost' : 'reportPost';
      const response = await axios.put(
        `http://localhost:3000/api/v1/post/${endpoint}/${postId}`,
        {},
        { headers: { authorization: token } }
      );
      
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId ? response.data.post : post
      ));
    } catch (err) {
      console.error(`Error ${isReported ? 'unreporting' : 'reporting'} post`, err);
    }
  };

  return (
    <div className="mt-8 ml-8">
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="w-[750px] rounded-lg shadow-xl bg-white">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <img
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    src={post.userImagePath ? `http://localhost:3000${post.userImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
                    alt={post.username}
                  />
                  <NavLink 
                    to={currentUserId === post.postedBy ? "/profile" : `/profile/${post.postedBy}`}
                    className="font-medium text-gray-900 hover:underline text-sm"
                  >
                    {post.username}
                  </NavLink>
                </div>
                {currentUserId !== post.postedBy && (
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(post._id)}
                      className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {showMenu[post._id] && (
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <button
                          className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 transition text-sm"
                          onClick={() => handleReportToggle(post._id, post.isReported)}
                        >
                          {post.isReported ? 'Undo Report' : 'Report Post'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <p className="text-gray-800 mb-3 text-sm">{post.text}</p>
              {post.postsImagePath && (
                <div className="flex justify-center mb-3">
                  <img
                    className="max-h-[400px] w-auto object-contain rounded-md"
                    src={`http://localhost:3000${post.postsImagePath}`} 
                    alt="Post content"
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-2">
                <button 
                  onClick={() => handleLike(post._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
                >
                  <Heart 
                    size={16}
                    className={post.likes.includes(currentUserId) ? 'fill-red-500 text-red-500' : ''} 
                  />
                  <span className="text-sm">{post.likes.length}</span>
                </button>
                <button 
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition"
                >
                  <MessageCircle size={16} />
                  <span className="text-sm">Comments</span>
                </button>
              </div>
              
              {showComments[post._id] && (
                <div className="mt-3 border-t pt-3">
                  <div className="mb-3">
                    <textarea
                      className="w-full p-2 border rounded-md resize-none text-sm"
                      placeholder="Write a comment..."
                      rows="2"
                    />
                    <button className="mt-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm">
                      Post Comment
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <img
                        className="w-6 h-6 rounded-full"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"
                        alt="Commenter"
                      />
                      <div>
                        <p className="font-medium text-sm">Username</p>
                        <p className="text-gray-600 text-sm">This is a placeholder comment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PostList;