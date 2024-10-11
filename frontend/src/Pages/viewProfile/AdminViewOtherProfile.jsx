import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import "./styles.css";

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
    <NavLink to="/adminHome">
        <button className="back-button" >
            <FaArrowLeft />
        </button>
    </NavLink>
      
      
      <div className="profile-grid">
        <div className="profile-card">
          <h2 className="card-title">User Profile</h2>
          <div className="profile-content">
            <div className="profile-image-container">
              <img
                src={profileImagePath ? `http://localhost:3000${profileImagePath}` : "https://via.placeholder.com/150"}
                alt="Profile"
                className="profile-image"
              />
            </div>

            <div className="profile-details">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Username:</strong> {username}</p>
              <p><strong>Email:</strong> {email}</p>
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

        <div className="posts-card">
          <h2 className="card-title">User's Posts</h2>
          <div className="posts-content">
            {/* You can add a component here to display the user's posts */}
            <p>User's posts will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOtherProfile;