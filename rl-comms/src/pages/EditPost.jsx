import React, { use } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../client';
import { useState, useEffect } from 'react';
import '../styles/EditPost.css'; // Create a CSS file for EditPost

const EditPost = () => {
    const { id: postId } = useParams(); // Get the post ID from the URL
    const [post, setPost] = useState({id: '', title: '', content: '', upvote: 0, creation_time: '', link: ''});

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', postId)
                .single();

            if (error) {
                console.error('Error fetching post:', error);
            } else {
                setPost(data);
            }
        };

        fetchPost();
    }, [postId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    }

    const updatePost = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('posts')
            .update({
                title: post.title,
                description: post.content,
                upvotes: post.upvote,
                created_at: post.creation_time,
                link: post.link,
            })
            .eq('id', postId);

        if (error) {
            console.error('Error updating post:', error);
        } else {
            console.log('Post updated successfully:', data);
            // Redirect to the updated post page or show a success message
            window.location.href = `/post/${postId}`;
        }
    };

    const deletePost = async () => {
        const { data, error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            console.error('Error deleting post:', error);
        } else {
            console.log('Post deleted successfully:', data);
            // Redirect to the landing page or show a success message
            window.location.href = '/';
        }
    };

    return (
        <div className="edit-post-container">
            <h2>Edit Post</h2>
            <form onSubmit={updatePost}>
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
                        type="text"
                        id="link"
                        name="link"
                        value={post.link}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Post</button>
            </form>
            <button onClick={deletePost} className="delete-button">Delete Post</button>
        </div>
    );
};

export default EditPost;

