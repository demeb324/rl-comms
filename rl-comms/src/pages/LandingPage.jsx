import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { Link } from "react-router-dom";
import '../styles/LandingPage.css';
import Card from '../components/Card';
//import { Input } from "@/components/ui/input" //Removed these since they caused errors
//import { Button } from "@/components/ui/button"
//import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue,
//} from "@/components/ui/select"

const LandingPage = () => {
    const [posts, setPosts] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [orderBy, setOrderBy] = useState('created_at'); // Default order
    const [orderDirection, setOrderDirection] = useState('desc');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let query = supabase
                .from('posts')
                .select('*');

            if (searchTitle) {
                query = query.ilike('title', `%${searchTitle}%`); // Search by title
            }

            // Add sorting
            query = query.order(orderBy, { ascending: orderDirection === 'asc' });

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
            }
            setLoading(false);
        };

        fetchPosts();
    }, [searchTitle, orderBy, orderDirection]);

    const handleSearchChange = (e) => {
        setSearchTitle(e.target.value);
    };

    const handleOrderByChange = (e) => {
        setOrderBy(e.target.value);
    };

    const handleOrderDirectionChange = (e) => {
        setOrderDirection(e.target.value);
    };

    return (
        <div className="landing-page-container">
            <header className="landing-page-header">
                <h1>Welcome to RL Comms</h1>
                <p>Share your clips and highlights with the community!</p>
                <p>Connect with teammates and coaches!</p>
                <p>Join the community and start sharing your content!</p>
            </header>

            <div className="landing-page-content">
                <div className="filter-bar">
                    <input  //Replaced Input with input
                        type="text"
                        placeholder="Search posts by title..."
                        value={searchTitle}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <div className="sort-filter">
                        <select  //Replaced Select with select
                            onChange={handleOrderByChange} //Added onChange
                            value={orderBy}
                         >
                            <option value="created_at">Creation Time</option>
                            <option value="upvotes">Upvotes</option>
                        </select>
                        <select  //Replaced Select with select
                            onChange={handleOrderDirectionChange} //Added onChange
                            value={orderDirection}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
                <h2>Latest Posts</h2>
                {loading ? (
                    <p>Loading posts...</p> // Simple loading indicator
                ) : (
                    <div className="posts-container">
                        {posts.map((post) => (
                            <Link to={`/post/${post.id}`} key={post.id}>
                                <Card
                                    creationTime={new Date(post.created_at).toLocaleString()}
                                    title={post.title}
                                    upvote={post.upvotes}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
