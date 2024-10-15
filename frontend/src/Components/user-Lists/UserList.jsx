import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaArrowLeft } from 'react-icons/fa';

const PostList = React.memo(() => {
  const [users, setUsers] = useState([]);
  const [showMenu, setShowMenu] = useState({});
  const [showComments, setShowComments] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/admin/viewAdminInfo", {
          headers: {
            authorization: token,
          },
        });
        console.log(response.data);
        setUserProfile(response.data.adminInfo); // Set the user profile data
      } catch (err) {
        console.error("Error fetching profile data", err);
      }
    };

    fetchProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  const {  userCount } = userProfile;

  const handleProfileClick = (postUserId) => {
    if (currentUserId === postUserId) {
      navigate('/profile');
    } else {
      navigate(`/viewOtherProfile/${postUserId}`);
    }
  };







  return (
    <div>
      <button className="back-button relative top-32 left-[22.5rem]" onClick={() => navigate(-1)}>
        <FaArrowLeft /> 
      </button>
    <div className="w-[60rem] min-h-[40rem] bg-gray-300 ml-[15rem] mt-[4rem] rounded-xl">
          
    <div className="flex justify-center mt-[5rem]">
        
      <div className="mt-8 ml-8">
     
      <h4 className="text-xl font-semibold mt-10">Total users:  {userCount}</h4>

            {users.map((user) => (
              <div key={user._id} className="w-[750px] mt-4 rounded-lg shadow-xl bg-white  focus:outline-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
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
    </div>
    </div>
    
  );
});

export default PostList;