import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import "./styles.css";
import OthersPost from '../../Components/post/OthersPost';

const ViewOtherProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authorization');
        const response = await axios.get(`http://localhost:3000/api/v1/user/viewOtherProfile/${id}`, {
          headers: {
            authorization: token,
          },
        });
        setUserInfo(response.data.userInfo);
      } catch (err) {
        console.error('Error fetching profile data', err);
      }
    };
    fetchProfile();
  }, [id]);

  if (!userInfo) return <div className="loading">Loading...</div>;

  const { profileImagePath, name, username, email, bio, department, graduationYear, friends } = userInfo;

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>
      
      <div className="profile-grid">
        <div className="profile-card">
          <h2 className="card-title">User Profile</h2>
          <div className="profile-content">
            <div className="profile-image-container">
              <img
                src={profileImagePath ? `http://localhost:3000${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"}
                alt="Profile"
                className="profile-image"
              />
            </div>

            <div className="profile-details">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Username:</strong> {username}</p>
              <p><strong>Department:</strong> {department}</p>
              <p><strong>Graduation Year:</strong> {graduationYear}</p>
            </div>

            <div className="bio-section">
            <p><strong>Bio:</strong></p>
              <div className="bio-content">
                <p>{bio}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="posts-card md:mt-1 sm:mt-1">

          <div className="posts-content" style={{overflowX: "hidden"}}>
            {/* You can add a component here to display the user's posts */}
            
            <OthersPost userId={userInfo._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOtherProfile;