import React from 'react';
import { supabase } from '../client';
import { useState } from 'react';
import '../styles/CreatePost.css';

const CreatePost = () => {
    const [post, setPost] = useState({
        title: '',
        content: '',
        upvote: 0,
        creation_time: new Date().toISOString(),
        link: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const createPost = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                title: post.title,
                description: post.content,
                upvotes: post.upvote,
                created_at: post.creation_time,
                link: post.link,
            }]);
        if (error) {
            console.error('Error creating post:', error);
        } else {
            console.log('Post created successfully:', data);
            // Redirect to the new post page or show a success message
            // For example, you can use window.location.href to redirect
            if (data && data.length > 0 && data[0] && data[0].id) {  // Safe access
                window.location.href = `/post/${data[0].id}`;
            } else {
                // Handle the case where data is not in the expected format
                console.warn("Data from Supabase insert is not in the expected format:", data);
                // Optionally, redirect to a safe page or show an error message to the user
                window.location.href = '/'; // Redirect to home as a safe fallback
            }
        }
    };

    return (
        <div className="create-post-container">
            <h2>Create a New Post</h2>
            <form onSubmit={createPost}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="link">Link:</label>
                    <input
                        type="url"
                        id="link"
                        name="link"
                        value={post.link}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePost;