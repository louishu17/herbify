import React from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

type LikesComponentProps = {
    userLiked: boolean;
    likesCount: number;
    onLikeClick: () => void;
    isLoading: boolean;
};

export const LikesComponent: React.FC<LikesComponentProps> = ({ userLiked, likesCount, onLikeClick, isLoading }) => {
    return (
        <div>
            <IconButton onClick={onLikeClick} aria-label="like" disabled={isLoading}>
                {userLiked ? <FavoriteIcon style={{ color: "red" }} /> : <FavoriteBorderIcon />}
            </IconButton>
            <span>{likesCount} Likes</span>
        </div>
    );
};