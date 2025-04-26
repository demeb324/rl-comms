import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../client';
import '../styles/PostPage.css';
// Error Boundary Component
class PostPageErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Error caught by PostPageErrorBoundary", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error-boundary">
                    <h2>Something went wrong.</h2>
                    <p>Sorry, there was an error loading this post. Please try again later.</p>
                    <Link to="/">Back to Home</Link>
                </div>
            );
        }

        return this.props.children; // Render the wrapped component if no error
    }
}

const PostPage = () => {
    const { id: postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [guestName, setGuestName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            setLoading(true);
            try {
                const { data: postData, error: postError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('id', postId)
                    .single();

                if (postError) {
                    console.error('Error fetching post:', postError);
                    throw new Error("Failed to fetch post"); // Throw error to be caught by ErrorBoundary
                } else {
                    setPost(postData);
                }

                const { data: commentsData, error: commentsError } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('post_id', postId)
                    .order('created_at', { ascending: true });

                if (commentsError) {
                    console.error('Error fetching comments:', commentsError);
                    throw new Error("Failed to fetch comments");  // Throw error
                } else {
                    setComments(commentsData);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndComments();
    }, [postId]);

    const handleAddComment = async (e) => {
        e.preventDefault();

        const commentData = {
            post_id: parseInt(postId),
            content: newComment,
            guest_name: guestName,
        };

        const { data, error } = await supabase.from('comments').insert([commentData]);

        if (error) {
            console.error('Error adding comment:', error);
             // Consider showing a user-friendly error message, but don't throw here.
            return;
        } else {
            setComments([...comments, { ...commentData, created_at: new Date().toISOString() }]);
            setNewComment('');
            setGuestName('');
        }
    };

    const handleUpvote = async () => {
        if (!post) return;

        const updatedUpvotes = post.upvotes + 1;
        setPost({ ...post, upvotes: updatedUpvotes });

        const { error } = await supabase
            .from('posts')
            .update({ upvotes: updatedUpvotes })
            .eq('id', postId);

        if (error) {
            console.error("Error updating upvotes:", error);
            setPost(post);
        } else {
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!post) {
        return <div>Post not found.</div>;
    }

      const isGif = post.link && post.link.toLowerCase().endsWith('.gif');


    return (
        <div className="post-page-container">
            <div className="post-detail">
                <h2>{post.title}</h2>
                {post.description && <p>{post.description}</p>}
                 {post.link && (
                    isGif ? (
                        <img src={post.link} alt={post.title}  />
                    ) : (
                        <a href={post.link} target="_blank" rel="noopener noreferrer">
                            {post.link}
                        </a>
                    )
                )}
                {post.image_url && <img src={post.image_url} alt={post.title} />}
                <p className="post-date">
                    {new Date(post.created_at).toLocaleString()}
                </p>
                <div className="post-upvotes">
                    Upvotes: {post.upvotes}
                    <button onClick={handleUpvote} className="ml-2">
                        +1
                    </button>
                </div>
                <div className="button-container">
                    <Link to={`/edit/${postId}`} className="button">Edit</Link>
                </div>
            </div>

            <div className="comments-section">
                <h3>Comments</h3>
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <p className="comment-author">{comment.guest_name || 'Guest'}</p>
                        <p className="comment-content">{comment.content}</p>
                        <p className="comment-date">
                            {new Date(comment.created_at).toLocaleString()}
                        </p>
                    </div>
                ))}

                <form onSubmit={handleAddComment} className="comment-form">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                    />
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        required
                    />
                    <button type="submit">Post Comment</button>
                </form>
            </div>
        </div>
    );
};

const PostPageWithErrorBoundary = () => {
     return (
        <PostPageErrorBoundary>
            <PostPage />
        </PostPageErrorBoundary>
    )
}

export default PostPageWithErrorBoundary;
