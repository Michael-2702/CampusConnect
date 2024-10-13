import React, { useState, useEffect } from "react";
import axios from "axios";

const OthersPost = React.memo(({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("authorization");
        
        console.log("Fetching posts for userId:", userId);

        const response = await axios.get(`http://localhost:3000/api/v1/post/userPosts/${userId}`, {
          headers: {
            authorization: token,
          },
        });

        console.log("Fetched Posts:", response.data);
        setPosts(response.data.posts || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts data", err);
        setError(`Failed to fetch posts: ${err.message}. 
                  Status: ${err.response?.status}. 
                  Response: ${JSON.stringify(err.response?.data)}`);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error Loading Posts:</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  if (posts.length === 0) {
    return <div>No posts found for this user.</div>;
  }

  return (
    <div>
      <h2>User Posts</h2>
      {posts.map((post) => (
        <div key={post._id} className="w-full rounded-xl shadow-md my-4 p-4">
          <div className="flex items-center mb-2">
            <img
              className="w-10 h-10 rounded-full object-cover mr-3"
              src={post.userImagePath ? `http://localhost:3000${post.userImagePath}` : "https://via.placeholder.com/40"} 
              alt="Profile"
            />
            <span className="font-medium">{post.username}</span>
          </div>
          <p className="text-gray-800 mb-2">{post.text}</p>
          {post.postsImagePath && (
            <img
              className="w-full max-h-96 object-cover rounded"
              src={`http://localhost:3000${post.postsImagePath}`} 
              alt="Post content"
            />
          )}
        </div>
      ))}
    </div>
  );
});

export default OthersPost;