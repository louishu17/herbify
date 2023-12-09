import React from 'react';
import Rating from '@mui/material/Rating';

type RatingComponentProps = {
    userRating: number;
    onRatingChange: (newRating: number) => void;
};

export const RatingComponent: React.FC<RatingComponentProps> = ({ userRating, onRatingChange }) => {
    return (
        <Rating
            name="recipe-rating"
            value={userRating}
            onChange={(event, newValue) => {
                if (newValue !== null) {
                    onRatingChange(newValue);
                }
            }}
        />
    );
};
