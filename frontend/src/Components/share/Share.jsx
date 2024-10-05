import { useState, useEffect } from "react";
import { GrGallery } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Share() {
  const [postText, setPostText] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file
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
        setUserProfile(response.data.userInfo); // Set the user profile data
      } catch (err) {
        console.error("Error fetching profile data", err);
      }
    };

    fetchProfile();
  }, []);

  // Handle loading state
  if (!userProfile) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  const { profileImagePath } = userProfile;

  const handleInputChange = (e) => {
    setPostText(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Update selectedFile state with the uploaded file
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem("authorization");
      const formData = new FormData(); // Create a FormData object to send files

      formData.append("text", postText); // Append post text
      if (selectedFile) {
        formData.append("picture", selectedFile); // Append the selected file
      }

      const response = await axios.post("http://localhost:3000/api/v1/post/createPost", formData, {
        headers: {
          authorization: token,
          "Content-Type": "multipart/form-data", // Set content type for file upload
        },
      });

      console.log(response.data); // Handle response from the server
      // Optionally reset input fields after successful post
      setPostText("");
      setSelectedFile(null);
      navigate("/Home");
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <div>
      <div className="w-[800px] mt-6 h-[170px] rounded-xl shadow-xl ml-5">
        <div className="p-3">
          <div className="flex items-center">
            {/* Profile picture placeholder */}
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
                <input type="file" accept="image/*" onChange={handleFileChange} /> {/* Input for file selection */}
              </div>
            </div>
            <button
              className="border-none p-2 rounded-md dark:bg-slate-900 font-bold mr-5 cursor-pointer text-white hover:dark:bg-slate-700"
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
