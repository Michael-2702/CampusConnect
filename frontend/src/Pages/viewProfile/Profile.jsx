import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import MyPostList from '../../Components/post/MyPosts';
import "./styles.css"

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
    return <div>Loading...</div>;
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
    <div className="flex min-h-screen mt-6">
      
      <div className="sticky top-6 max-h-[600px] w-[600px] rounded-3xl mb-5 p-8 text-black shadow-xl">
        <div className="flex  flex-col mb-[-6rem]">
        <a href="home">
          <img className='w-[5rem] h-[3rem] ml-[-1rem] pointer' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoTGv-jWGC-M2rxoKNw4Ge5X-__8z-TGEhEg&s" />
        </a>
        
          <div className="w-[6rem] h-[6rem] ml-[-1.5rem] relative bottom-[3rem] left-[5rem] rounded-full border-2 border-white overflow-hidden">
          
            <img 
              src={profileImagePath ? `http://localhost:3000${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
              alt="Profile" 
              className="w-full bg-slate-200 h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center relative bottom-[10rem] right-[-5rem]">
            <input
              type="file"
              className="file-input"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <div >
            <button 
              type="submit" 
              className="float-right relative bottom-[9.5rem] right-[16.2rem] text-white px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-600 transition"
              onClick={profilePicHandler}
            >
              Save
            </button>
          </div>
        </div>
        
        <div className="mb-4"><span className='mb-5 text-xl'>Name: </span> <span>{name}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Username: </span> <span>{username}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Email: </span> <span>{email}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Department: </span> <span>{department}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Graduation Year: </span> <span>{graduationYear}</span></div>
        
        <div className="mb-4">
          <span className='mb-5 text-xl'>Bio: </span>
          {isEditingBio ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="4"
                maxLength="200"
              />
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="float-right text-white px-4 py-1 bg-blue-700 rounded-md hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* <span>{bio}</span>
              <button 
                onClick={() => setIsEditingBio(true)}
                className="ml-4  text-white px-4 py-1 bg-blue-700 rounded-md hover:bg-blue-600 transition"
              >
                Edit Bio
              </button> */}
              <div>
                    <p className="text-gray-600">{bio}</p>
                    <button 
                      onClick={() => setIsEditingBio(true)}
                      className="mt-2 text-indigo-600 hover:text-indigo-800 transition"
                    >
                      Edit Bio
                    </button>
                  </div>
            </>
          )}
        </div>
      </div>
      <MyPostList className="justify-self-end "/>
    </div>
  );
}

export default Profile;