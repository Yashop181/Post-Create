import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import "./CreatePost.css"
import { toast } from 'react-toastify';
const CreatePost = () => {
    const [newPost , setNewPost] = useState({
        title:"",
        content: "",
        file:null
    })
    const handleInputChange = (event)=>{
        const {name ,value} = event.target;
        setNewPost({...newPost,[name]:value});
    };
    const handleFileChange = (event)=>{
        setNewPost({...newPost, file: event.target.files[0]});
    }


    const handlePostSubmit = () => {
        if (!newPost.title || !newPost.content || !newPost.file) {
            toast.error("Please fill in all fields.");
            return;
        }
    
        const formData = new FormData();
        formData.append("title", newPost.title);
        formData.append("content", newPost.content);
        formData.append("file", newPost.file);
    
        axios.post("http://localhost:5000/api/posts", formData)
            .then((response) => {
                toast.success("Post created successfully!");
                setNewPost({ title: "", content: "", file: null });
            })
            .catch((error) => {
                toast.error("Error creating post. Please try again later.");
                console.error("Error creating post:", error);
            });
    };
    
  return (
    <>
        <div className='create-post'>
            <h2>Create a Post</h2>
            <input type='text' name='title' placeholder='Title' value={newPost.title} onChange={handleInputChange}  />
            <textarea name='content' placeholder='Content' value={newPost.content} onChange={handleInputChange}></textarea>
            <input type='file' name='file' onChange={handleFileChange} /> 
            <button onClick={handlePostSubmit}>Post</button>

        </div>
    </>
  )
}

export default CreatePost
