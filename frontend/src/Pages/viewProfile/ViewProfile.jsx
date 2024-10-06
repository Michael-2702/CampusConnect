import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authorization');
        const response = await axios.get('http://localhost:3000/api/v1/user/viewProfile', {
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
  }, []);

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="bg-white shadow rounded-lg p-4">
        <p className="mb-2"><span className="font-semibold">Username:</span> {userInfo.username}</p>
        <p className="mb-2"><span className="font-semibold">Email:</span> {userInfo.email}</p>
        {/* Add more user info fields as needed */}
      </div>
      <button 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => navigate('/')}
      >
        Back to Posts
      </button>
    </div>
  );
};

export default ViewProfile;