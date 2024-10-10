import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import "./styles.css";  // Same stylesheet as the Profile component

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

  if (!userInfo) return <div>Loading...</div>;

  const { profileImagePath, name, username, email, bio, department, graduationYear, friends } = userInfo;

  return (
    <div className="flex min-h-screen mt-6">
      <div className="sticky top-6 max-h-[600px] w-[600px] rounded-3xl mb-5 p-8 text-black shadow-xl">
        <div className="flex flex-col mb-[-6rem]">
          <NavLink to="/home">
            <img className='w-[5rem] h-[3rem] ml-[-1rem] pointer' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoTGv-jWGC-M2rxoKNw4Ge5X-__8z-TGEhEg&s" />
          </NavLink>
          <div className="w-[6rem] h-[6rem] ml-[-1.5rem] relative bottom-[3rem] left-[5rem] rounded-full border-2 border-white overflow-hidden">
            <img
              src={profileImagePath ? `http://localhost:3000${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"}
              alt="Profile"
              className="w-full bg-slate-200 h-full object-cover"
            />
          </div>
        </div>
        
        <div className="mb-4"><span className='mb-5 text-xl'>Name: </span> <span>{name}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Username: </span> <span>{username}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Email: </span> <span>{email}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Department: </span> <span>{department}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Graduation Year: </span> <span>{graduationYear}</span></div>
        <div className="mb-4"><span className='mb-5 text-xl'>Bio: </span> <span>{bio}</span></div>
        
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => navigate('/home')}
        >
          Back to Posts
        </button>
      </div>
    </div>
  );
};

export default ViewOtherProfile;