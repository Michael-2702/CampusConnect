import React, { useState, useEffect } from "react";
import { GrGallery } from "react-icons/gr";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Share() {
  const [postText, setPostText] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/user/viewProfile", {
          headers: {
            authorization: token,
          },
        });
        setUserProfile(response.data.userInfo);
      } catch (err) {
        console.error("Error fetching profile data", err);
        setError("Failed to load profile. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setPostText(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    const file = e.target.files;
    const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file && !validExtensions.includes(file.type)) {
      alert("Please select a valid image file (PNG, JPEG, or JPG only).");
      e.target.value = null; // Clear the file input
      return;
    }
    
    if (!postText.trim() && !selectedFile) {
      alert("Please enter some text or select an image to post.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("authorization");
      const formData = new FormData();

      if (postText.trim()) {
        formData.append("text", postText.trim());
      }
      if (selectedFile) {
        formData.append("picture", selectedFile);
      }

      const response = await axios.post("http://localhost:3000/api/v1/post/createPost", formData, {
        headers: {
          authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      setPostText("");
      setSelectedFile(null);
      navigate(0); // This is a more React-friendly way to reload the page
    } catch (error) {
      console.error("Error uploading post:", error);
      setError(error.response?.data?.msg || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!userProfile) {
    return <div className="text-center p-4">Loading...</div>;
  }

  const { profileImagePath } = userProfile;

  return (
    <div className="lg:max-w-[750px] md:w-[580px] md:relative md:left-[3rem] mx-auto mt-19 ml-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <img
            className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-gray-200"
            src={profileImagePath ? `http://localhost:3000${profileImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"}
            alt="Profile"
          />
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={postText}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <GrGallery className="text-gray-500" size={20} />
            <span className="text-sm text-gray-600">Upload Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {selectedFile && (
            <span className="text-sm text-gray-600">
              {selectedFile.name}
            </span>
          )}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold flex items-center space-x-2 hover:bg-blue-700   transition duration-300 disabled:opacity-50"
            onClick={handleShare}
            disabled={isLoading}
          >
            <FiSend />
            <span>{isLoading ? "Posting..." : "Share"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}