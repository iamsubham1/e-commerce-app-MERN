import React from 'react';

const StarRating = ({ rating }) => {
    // Calculate the number of filled and empty stars
    const filledStars = Math.round(rating * 2) / 2;
    const emptyStars = 5 - filledStars;

    return (
        <div className="star-rating">
            {/* Render filled stars */}
            {[...Array(Math.floor(filledStars))].map((_, index) => (
                <span key={index} className="star">&#9733;</span>
            ))}
            {/* Render half star if needed */}
            {filledStars % 1 !== 0 && (
                <span className="star">&#9734;</span>
            )}
            {/* Render empty stars */}
            {[...Array(Math.floor(emptyStars))].map((_, index) => (
                <span key={index} className="star">&#9734;</span>
            ))}
        </div>
    );
};

export default StarRating;
