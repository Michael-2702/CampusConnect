import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Heart, MessageCircle, MoreVertical } from 'lucide-react';

const PostList = React.memo(() => {
  const [users, setUsers] = useState([]);
  const [showMenu, setShowMenu] = useState({});
  const [showComments, setShowComments] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/admin/viewAllUsers", {
          headers: { authorization: token },
        });
        setUsers(response.data);
        
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







  return (
    <div className="mt-8 ml-8">
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="w-[750px] rounded-lg shadow-xl bg-white">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <img
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    src={user.profileImagePath ? `http://localhost:3000${user.profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
                    alt={user.username}
                  />
                  <NavLink 
                    to={`/adminViewProfile/${user._id}`}
                    className="font-medium text-gray-900 hover:underline text-sm"
                  >
                    {user.username}
                  </NavLink>
                </div>
                
              </div>
              
              
              
              
              
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PostList;