import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css"
import { toast } from 'react-toastify';
const Home = () => {
  const [commentInput, setCommentInput] = useState("");
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error Fetching Posts:", error));
  }, []);

  const handleLike = (postId) => {
    axios
      .post(`http://localhost:5000/api/posts/like/${postId}`)
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? response.data : post
        );
        setPosts(updatedPosts);
        toast.success('Post liked successfully!');
      })
      .catch((error) => console.error("Error Liking Posts:", error));
  };

  const handleAddComments = (postId, commentText) => {
    axios
      .post(`http://localhost:5000/api/posts/comment/${postId}`, {
        text: commentText,
      })
      .then((response) => {
        const updatedPosts = posts.map((post) =>
          post._id === postId ? response.data : post
        );
        setPosts(updatedPosts);
        toast.success('Comment added successfully!');
      })
      .catch((error) => console.error("Error Adding Comment", error));
  };
  return (
    <>
      <div className="rect">
        <h2>Recent Posts</h2>
      </div>

      <div className="home">

        {posts.map((post) => {
          return (
            <div key={post._id} className="post">
              <h3>{post.title}</h3>
              <p>{post.content}</p>

              {post.file && (
                <div className="post-media">
                  {post.file.includes(".mp4") ? (
                    <video width={320} height={240} controls>
                      <source
                        src={`http://localhost:5000/uploads/${post.file}`}
                        type="video/mp4"
                      />
                      Your Browser does not support the video tag
                    </video>
                  ) : (
                    <img
                      src={`http://localhost:5000/uploads/${post.file}`}
                      alt="Post media"
                    />
                  )}
                </div>
              )}
              <p>Likes: {post.likes}</p>
              <button onClick={() => handleLike(post._id)}>Like</button>
              <p>Comments: {post.comments.length}</p>
              <ul>
                {post.comments.map((comment, index) => (
                  <li key={index}>{comment.text}</li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Add a comment"
                className="comment-input"
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button onClick={() => handleAddComments(post._id, commentInput)}>
                Add comment
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
