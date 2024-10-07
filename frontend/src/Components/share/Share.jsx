import { useState, useEffect } from "react";
import { GrGallery } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Share() {
  const [postText, setPostText] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

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
      }
    };

    fetchProfile();
  }, []);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  const { profileImagePath } = userProfile;

  const handleInputChange = (e) => {
    setPostText(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    
    if (!postText.trim() && !selectedFile) {
      alert("Please enter some text or select an image to post.");
      return;
    }

    try {
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
      window.location.reload();
    } catch (error) {
      console.error("Error uploading post:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.msg || "An error occurred while creating the post.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="w-[800px] mt-6 h-[170px] rounded-xl shadow-xl ml-5">
        <div className="p-3">
          <div className="flex items-center">
            <img
              className="w-12 h-12 rounded-full object-cover mr-3 border-2"
              src={`http://localhost:3000${profileImagePath}`}
              alt="Profile"
            />
            <input
              placeholder="Post here ..."
              className="border-none outline-none w-[80%]"
              value={postText}
              onChange={handleInputChange}
            />
          </div>
          <hr className="m-5 border-gray-500" />
          <div className="flex justify-around">
            <div className="flex ml-5">
              <div className="flex items-center mr-[110px] cursor-pointer">
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
            <button
              className="border-none p-2 rounded-md bg-slate-900 font-bold mr-5 cursor-pointer text-white hover:bg-slate-700"
              onClick={handleShare}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}