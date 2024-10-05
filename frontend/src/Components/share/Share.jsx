import { useState, useEffect } from "react";
import { GrGallery } from "react-icons/gr";
import { HiOutlineHashtag } from "react-icons/hi";
import axios from "axios";

export default function Share() {
  const [postText, setPostText] = useState("");

  const [userProfile, setUserProfile] = useState(null);

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

  const handleShare = () => {
    try{
      const token = localStorage.getItem("authorization")
      axios.post("http://localhost:3000/api/v1/post/createPost", {
        headers: {
          authorization: token
        }
      })
    }
    catch(e){

    }
  };

  return (
    <div>
      
      <div  className="w-[800px] h-[170px] rounded-xl shadow-xl ml-5">
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
                
                <input type="file"></input>
              </div>
              {/* <div className="flex items-center mr-4 cursor-pointer">
                <HiOutlineHashtag />
                <span className="ml-1 text-lg">Tag</span>
              </div> */}
            </div>
            <button
              className="border-none p-2 rounded-md bg-red-600 font-bold mr-5 cursor-pointer text-white"
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
