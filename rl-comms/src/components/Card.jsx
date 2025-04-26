import React from "react";
import { Link } from "react-router-dom";
import "../styles/Card.css";

const Card = ({creationTime, title, upvote}) => {
    return (
        <div className="card-container">
            <div className="card-header">
                <h2>{title}</h2>
                <p>{creationTime}</p>
            </div>
            <div className="card-body">
                <p>Upvotes: {upvote}</p>
            </div>
        </div>
    );
}

export default Card;
// This component is a simple card that displays the title, creation time, and upvotes of a post.