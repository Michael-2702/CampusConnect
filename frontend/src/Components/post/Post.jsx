import { useState, useEffect } from "react";
import axios from "axios";

export default function Post({ postId }) {
  const [post, setPost] = useState(null);
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        setPost(response.data);
        setLike(response.data.likes || 0); // Assume the API returns a `likes` field
      } catch (err) {
        console.error("Error fetching post data", err);
      }
    };

    fetchPost();
  }, [postId]);

  const likeHandler = () => {
    setLike(isLiked ? like + 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="w-[800px] rounded-xl shadow-2xl m-5">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              className="w-8 h-8 rounded-full object-cover border-2"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
            <span className="size-4 font-medium my-2 ml-1 pb-2">
              {/* Display post author name */}
              {post?.title || "Name"}
            </span>
          </div>
          <div className="postTopRight flex item-center"></div>
        </div>
        <div className="m-5">
          <span className="postText">{post?.body || "This is a post!"}</span>
          <img
            className="mt-5 w-full max-h-[400px] object-contain"
            src="public/free-nature-images.jpg"
            alt="Post content"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex">
            <img
              className="w-6 h-6 ml-5 mr-2 cursor-pointer"
              src="public\hand-thumb.png"
              onClick={likeHandler}
              alt="Like button"
            />
            <span className="size-4">{like}</span>
          </div>
          <div className="postBottomRight">
            <span className="cursor-pointer size-4">{post?.comments || 5} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
