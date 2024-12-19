import React, { useState, useEffect, useNavigate } from "react";
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { Heart, MessageCircle, Edit2, Trash2, MoreVertical, Send, X } from 'lucide-react';

const AdminPost = React.memo(() => {
  const [posts, setPosts] = useState([]);
  const [showMenu, setShowMenu] = useState({});
  const [showComments, setShowComments] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [showLikedUsers, setShowLikedUsers] = useState({});
  // const navigate = useNavigate();



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3001/api/v2/post/viewPosts", {
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

  // const handleProfileClick = (postUserId) => {
    
  //   navigate(`/profile/${postUserId}`);
    
  // };

  const toggleMenu = (postId) => {
    setShowMenu((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Toggle the menu visibility for the clicked post
    }));
  };

  const toggleComments = async (postId) => {
      setShowComments((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      if (!showComments[postId]) {
        try {
          const token = localStorage.getItem("authorization");
          const response = await axios.get(`http://localhost:3001/api/v2/admin/comment/${postId}`, {
            headers: { authorization: token },
          });
          setPosts(prevPosts => prevPosts.map(post => 
            post._id === postId ? { ...post, comments: response.data.comments } : post
          ));
        } catch (err) {
          console.error("Error fetching comments", err);
        }
      }
    };

    const handlePostComment = async (postId) => {
      try {
          const token = localStorage.getItem("authorization");
          const response = await axios.put(
              `http://localhost:3001/api/v2/post/comment/${postId}`,
              { content: newComments[postId] },
              { headers: { authorization: token } }
          );
  
          // Extract the processed comment from the response
          const { processedComment } = response.data;
  
          // Update the posts state to include the new comment immediately
          setPosts((prevPosts) =>
              prevPosts.map((post) =>
                  post._id === postId
                      ? {
                            ...post,
                            comments: [...post.comments, processedComment], // Add the new comment here
                        }
                      : post
              )
          );
  
          // Clear the input field for the new comment
          setNewComments((prev) => ({ ...prev, [postId]: '' }));
  
          // Optionally, you can toggle comments to show the newly added comment
          toggleComments(postId); // if you want to ensure comments are displayed
      } catch (err) {
          console.error("Error posting comment", err);
      }
    };
  
    const handleDeleteComment = async (postId, commentId) => {
      try {
        const token = localStorage.getItem("authorization");
        await axios.delete(
          `http://localhost:3001/api/v2/admin/comment/${postId}/${commentId}`,
          { headers: { authorization: token } }
        );
        
        setPosts(prevPosts => prevPosts.map(post => 
          post._id === postId 
            ? { ...post, comments: post.comments.filter(comment => comment._id !== commentId) }
            : post
        ));
      } catch (err) {
        console.error("Error deleting comment", err);
      }
    };
  
    

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem("authorization");
      await axios.delete(`http://localhost:3001/api/v2/admin/deletePost/${postId}`, {
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
                  src={post.userImagePath ? `http://localhost:3001${post.userImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
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
                  src={`http://localhost:3001${post.postsImagePath}`} 
                  alt="Post content"
                />
              )}
            </div>
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
                onClick={() => toggleLikedUsers(post._id)}
                className="text-sm text-blue-500 hover:underline"
              >
                {showLikedUsers[post._id] ? 'Hide' : 'View'} Likes
              </button>
                <button 
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition"
                >
                  <MessageCircle size={16} />
                  <span className="text-sm">{post.comments ? post.comments.length : 0} Comments</span>
                </button>
              </div>
              
              {showLikedUsers[post._id] && post.likedUsers && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">Liked by:</h4>
                  <button 
                    onClick={() => setShowLikedUsers(prev => ({ ...prev, [post._id]: false }))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {post.likedUsers.map(user => (
                    <div key={user._id} className="flex items-center space-x-2 mb-2">
                      <img
                        className="w-6 h-6 rounded-full object-cover"
                        src={user.profileImagePath ? `http://localhost:3001${user.profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"}
                        alt={user.username}
                      />
                      <span className="text-sm">{user.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
              
            {showComments[post._id] && (
              <div className="mt-3 border-t pt-3">
                <div className="mb-3 flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-grow p-2 border rounded-md text-sm"
                    placeholder="Write a comment..."
                    value={newComments[post._id] || ''}
                    onChange={(e) => setNewComments(prev => ({ ...prev, [post._id]: e.target.value }))}
                  />
                  <button 
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm flex items-center"
                    onClick={() => handlePostComment(post._id)}
                  >
                    <Send size={16} className="mr-1" /> Post
                  </button>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                {post.comments && post.comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-2 bg-gray-50 p-2 rounded-lg">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={
                        comment.user && comment.user.profileImagePath
                          ? `http://localhost:3001${comment.user.profileImagePath}`
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"
                      }
                      alt={comment.user ? comment.user.username : "User"}
                    />
                    <div className="flex-grow">
                    <NavLink to={`/adminViewProfile/${post.postedBy}`} className="mt-4 inline-block text-blue-500">
                      <button 
                          
                          className="font-medium text-gray-900 hover:underline text-sm"
                        >
                          {comment.user ? comment.user.username : "unknown user" }
                        </button>
                     </NavLink>
                      
                      {editingComments[comment._id] ? (
                        <div className="mt-1 flex items-center space-x-2">
                          <input
                            type="text"
                            className="flex-grow p-1 border rounded-md text-sm"
                            value={editingComments[comment._id]}
                            onChange={(e) => setEditingComments(prev => ({ ...prev, [comment._id]: e.target.value }))}
                          />
                          <button
                            onClick={() => handleEditComment(post._id, comment._id)}
                            className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-xs"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm">{comment.content}</p>
                      )}
                      
                        <div className="mt-1 space-x-2">
                          
                          <button
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                            className="text-red-500 hover:text-red-600 text-xs  relative bottom-12 left-[44rem]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  );
});

export default AdminPost;