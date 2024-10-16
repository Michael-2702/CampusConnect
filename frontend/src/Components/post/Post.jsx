import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Heart, MessageCircle, Edit2, Trash2, MoreVertical, Send, X } from 'lucide-react';

const PostList = React.memo(() => {
  const [posts, setPosts] = useState([]);
  const [showMenu, setShowMenu] = useState({});
  const [showComments, setShowComments] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [showLikedUsers, setShowLikedUsers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authorization");
  
        // Run both requests in parallel for efficiency
        const [postsResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/v1/post/viewPosts", {
            headers: { authorization: token },
          }),
          axios.get("http://localhost:3000/api/v1/user/viewProfile", {
            headers: { authorization: token },
          })
        ]);
  
        // Ensure each post has comments as an array
        const postsData = postsResponse.data.map(post => ({
          ...post,
          comments: Array.isArray(post.comments) ? post.comments : [], // Ensure comments is an array
        }));
  
        setPosts(postsData);
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
      navigate(`/profile/${postUserId}`);
    }
  };

  const toggleMenu = (postId) => {
    setShowMenu((prev) => ({
      ...prev,
      [postId]: !prev[postId],
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
        const response = await axios.get(`http://localhost:3000/api/v1/post/getComments/${postId}`, {
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

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("authorization");
      const response = await axios.put(
        `http://localhost:3000/api/v1/post/like/${postId}`,
        {},
        { headers: { authorization: token } }
      );
      
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId 
          ? { ...post, likes: response.data.likes, likedUsers: response.data.likedUsers }
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

  const handlePostComment = async (postId) => {
    try {
        const token = localStorage.getItem("authorization");
        const response = await axios.put(
            `http://localhost:3000/api/v1/post/comment/${postId}`,
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
        `http://localhost:3000/api/v1/post/deleteComment/${postId}/${commentId}`,
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

  const handleEditComment = async (postId, commentId) => {
    // Check if we are currently editing the comment
    if (editingComments[commentId]) {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.put(
          `http://localhost:3000/api/v1/post/updateComment/${postId}/${commentId}`,
          { content: editingComments[commentId] },
          { headers: { authorization: token } }
        );
  
        // Update the posts state to reflect the edited comment
        setPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === postId
              ? {
                  ...post,
                  comments: post.comments.map(comment =>
                    comment._id === commentId ? response.data.updatedComment : comment
                  )
                }
              : post
          )
        );
  
        // Clear the editing comment input
        setEditingComments(prev => ({ ...prev, [commentId]: '' }));
        toggleComments(postId);
      } catch (err) {
        console.error("Error updating comment", err);
      }
    } else {
      // Enable editing mode for the selected comment
      const commentContent = posts
        .find(post => post._id === postId)
        .comments.find(comment => comment._id === commentId).content;
  
      setEditingComments(prev => ({
        ...prev,
        [commentId]: commentContent // Set the content to the current comment's content
      }));
    }
  };
  

  const toggleLikedUsers = async (postId) => {
    if (showLikedUsers[postId]) {
      setShowLikedUsers(prev => ({ ...prev, [postId]: false }));
    } else {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get(`http://localhost:3000/api/v1/post/likedUsers/${postId}`, {
          headers: { authorization: token },
        });
        setPosts(prevPosts => prevPosts.map(post => 
          post._id === postId ? { ...post, likedUsers: response.data.likedUsers } : post
        ));
        setShowLikedUsers(prev => ({ ...prev, [postId]: true }));
      } catch (err) {
        console.error("Error fetching liked users", err);
      }
    }
  };


  return (
    <div className="mt-8 ml-8">
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="w-[720px] rounded-lg shadow-xl bg-white">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <img
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    src={post.userImagePath ? `http://localhost:3000${post.userImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
                    alt={post.username}
                  />
                  <button 
                    onClick={() => handleProfileClick(post.postedBy)}
                    className="font-medium text-gray-900 hover:underline text-sm"
                  >
                    {post.username}
                  </button>
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
                    className="max-h-[500px] max-w-full w-auto h-auto object-contain rounded-md"
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
                        src={user.profileImagePath ? `http://localhost:3000${user.profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"}
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
                          ? `http://localhost:3000${comment.user.profileImagePath}`
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"
                      }
                      alt={comment.user ? comment.user.username : "User"}
                    />
                    <div className="flex-grow">
                    
                      <button 
                          onClick={() => handleProfileClick(comment.user._id)}
                          className="font-medium text-gray-900 hover:underline text-sm"
                        >
                          {comment.user ? comment.user.username : "unknown user" }
                        </button>

                      
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
                      {currentUserId === (comment.user ? comment.user._id : null) && !editingComments[comment._id] && (
                        <div className="mt-1 space-x-2">
                          <button
                            onClick={() => handleEditComment(post._id, comment._id)}
                            className="text-blue-500 hover:text-blue-600 text-xs relative bottom-[2.8rem] left-[38.7rem]"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(post._id, comment._id)}
                            className="text-red-500 hover:text-red-600 text-xs relative bottom-[2.7rem] left-[39rem]"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
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
    </div>
  );
});

export default PostList;