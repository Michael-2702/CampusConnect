import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyPostList from '../../Components/post/MyPosts';
import { FaUserEdit, FaArrowLeft } from 'react-icons/fa';
import "./styles.css";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({ bio: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authorization");
      const response = await axios.get("http://localhost:3000/api/v1/user/viewProfile", {
        headers: {
          authorization: token,
        },
      });
      setUserProfile(response.data.userInfo);
      setFormData({ bio: response.data.userInfo.bio });
    } catch (err) {
      console.error("Error fetching profile data", err);
    }
  };

  if (!userProfile) {
    return <div className="loading">Loading...</div>;
  }

  const { profileImagePath, name, username, email, bio, department, graduationYear, friends } = userProfile;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await bioHandler();
  };

  const profilePicHandler = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }
  
    try {
      const token = localStorage.getItem("authorization");
      const formData = new FormData();
      formData.append("picture", selectedFile);
  
      await axios.put("http://localhost:3000/api/v1/user/updateProfilePicture", formData, {
        headers: {
          authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      
      window.location.reload();
      
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const bioHandler = async () => {
    try {
      const token = localStorage.getItem("authorization");
      const response = await axios.put("http://localhost:3000/api/v1/user/updateBio", 
        { bio: formData.bio },
        {
          headers: {
            authorization: token
          }
        }
      );

      console.log("Bio updated successfully:", response.data);
      setIsEditingBio(false);
      
      // Reload the page to show updated bio
      window.location.reload();
    } catch (error) {
      console.error("Error updating bio:", error);
      if (error.response) {
        alert(error.response.data.msg || "An error occurred while updating the bio");
      } else {
        alert("An error occurred while updating the bio");
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="container" >
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> 
      </button>
      
      <div className="profile-grid">
        <div className="profile-card lg:w-[22rem] ">
          <h2 className="card-title">Profile</h2>
          <div className="profile-content">
            <div className="profile-image-container">
              <img
                src={profileImagePath ? `http://localhost:3000${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"}
                alt="Profile"
                className="profile-image"
                style={{position: "relative", left: "3rem"}}
              />
              <input
                type="file"
                id="profile-pic-input"
                onChange={handleFileChange}
                accept="image/*"
                style={{display: 'none'}}
              />
              <div className="profile-image-buttons">
                <label htmlFor="profile-pic-input" className="button">Change Picture</label>
                <button onClick={profilePicHandler} disabled={!selectedFile} className="button">
                  Save Picture
                </button>
              </div>
            </div>

            <div className="profile-details">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Department:</strong> {department}</p>
              <p><strong>Graduation Year:</strong> {graduationYear}</p>
            </div>

            <div className="bio-section">
              <p><strong>Bio:</strong></p>
              {isEditingBio ? (
                <form onSubmit={handleSubmit} className="bio-form">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    maxLength="200"
                    placeholder="Write your bio here..."
                  />
                  <button type="submit" className="button">Save Bio</button>
                </form>
              ) : (
                <div className="bio-content">
                  <p>{bio}</p>
                  <button onClick={() => setIsEditingBio(true)} className="button edit-bio-button">
                    <FaUserEdit /> Edit Bio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="posts-card md:mt-1 lg:mt-[-1rem] sm:mt-1">
          <h2 className="card-title">My Posts</h2>
          <div className="posts-content">
            <MyPostList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;