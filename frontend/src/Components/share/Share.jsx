import { useState } from "react";
import { GrGallery } from "react-icons/gr";
import { HiOutlineHashtag } from "react-icons/hi";

export default function Share() {
  const [postText, setPostText] = useState("");

  const handleInputChange = (e) => {
    setPostText(e.target.value);
  };

  const handleShare = () => {
    if (postText.trim()) {
      console.log("Post shared:", postText);
      // You can make an API call here to share the post
      setPostText(""); // Reset the input field after sharing
    } else {
      console.log("Post cannot be empty");
    }
  };

  return (
    <div className="w-[800px] h-[170px] rounded-xl shadow-xl ml-5">
      <div className="p-3">
        <div className="flex items-center">
          {/* Profile picture placeholder */}
          <img
            className="w-12 h-12 rounded-full object-cover mr-3 border-2"
            src="https://via.placeholder.com/150"
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
              <GrGallery />
              <span className="ml-2 text-lg">Photo or Video</span>
            </div>
            <div className="flex items-center mr-4 cursor-pointer">
              <HiOutlineHashtag />
              <span className="ml-1 text-lg">Tag</span>
            </div>
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
  );
}
