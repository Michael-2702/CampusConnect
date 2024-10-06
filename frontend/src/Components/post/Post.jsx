import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const PostList = React.memo(() => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authorization");
        const response = await axios.get("http://localhost:3000/api/v1/post/viewPosts", {
          headers: {
            authorization: token,
          },
        });

        console.log("Fetched Posts:", response.data);
        setPosts(response.data);

      } catch (err) {
        console.error("Error fetching posts data", err);

      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures it runs once after mount

  console.log("Rendering PostList with posts:", posts);

  return (
    <div>
      {posts.map((post) => (
        <div key={post._id} className="w-[800px] rounded-xl shadow-2xl m-5">
          <div className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="w-12 h-12 ml-4 mt-4 rounded-full object-cover border-2"
                  src={post.userImagePath ? `http://localhost:3000${post.userImagePath}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfOc2xqD2qG5m9jhgVOuAzLQj8Yotn8Ydp-Q&s"} 
                  alt="Profile"
                />
                <span className="size-4 text-black font-medium my-2 mt-5 ml-3 pb-2">
                  {post.username}
                </span>
              </div>
            </div>
            <hr className="m-5 border-gray-500" />
            <div className="postText ml-6 max-w-[800px]">{post.text}</div>
            <div className="m-5 flex justify-center">
             
              {post.postsImagePath && (
                <img
                  className="mt-5  max-h-[500px] w-auto object-fit:contain"
                  src={`http://localhost:3000${post.postsImagePath}`} 
                  alt="Post content"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default PostList;