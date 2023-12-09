import React from 'react';
import { Avatar, Typography, Button, Box, ListItem, TextField } from "@mui/material";
import { useImageForProfilePic, INVALID_S3_FILENAME } from "@/lib/profilePicHooks"; // Adjust the import paths as needed

// Define the structure of a comment
interface Comment {
    id: number;
    text: string;
    user_id: number;
    timestamp: string;
    profilePicS3Filename?: string;
    firstName?: string;
    replies?: Comment[];
}

// Define the props for the CommentItem component
interface CommentItemProps {
    comment: Comment;
    onReplyClick: (commentId: number) => void;
    replyTo: number | null;
    handlePostComment: (commentId: number) => void;
    handleSetReplyComment: (commentId: number, text: string) => void;
    replyComments: { [key: number]: string };
    isPostingComment: boolean;
    depth?: number; // Optional depth for styling nested replies
}
// CommentItem component
const CommentItem: React.FC<CommentItemProps> = ({ 
    comment, 
    onReplyClick, 
    replyTo, 
    handlePostComment, 
    handleSetReplyComment, 
    replyComments, 
    isPostingComment,
    depth = 0 // Default depth is 0
}) => {
    const { data: profilePicSrc, isLoading: isLoadingProfilePicSrc, isError: isErrorLoadingProfilePicSrc } = useImageForProfilePic(comment.profilePicS3Filename || INVALID_S3_FILENAME);

    // Logic to render the comment
    return (
        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar 
                    src={!isLoadingProfilePicSrc && !isErrorLoadingProfilePicSrc ? profilePicSrc : INVALID_S3_FILENAME}
                    alt={comment.firstName || `User ${comment.user_id}`}
                    sx={{ width: 40, height: 40, marginRight: 2 }}
                />
                <Box>
                    <Typography style={{ fontSize: '0.75rem' }}>
                        {comment.firstName || `User ${comment.user_id}`}
                        {/* Your logic to display timestamp */}
                    </Typography>
                    <Typography variant="body1">{comment.text}</Typography>
                </Box>
            </Box>
            <Button 
                size="small" 
                onClick={() => onReplyClick(comment.id)}>
                {replyTo === comment.id ? 'Cancel' : 'Reply'}
            </Button>
            {replyTo === comment.id && (
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Reply"
                        value={replyComments[comment.id] || ''}
                        onChange={(e) => handleSetReplyComment(comment.id, e.target.value)}
                        fullWidth
                        multiline
                    />
                    <Button 
                        onClick={() => handlePostComment(comment.id)} 
                        disabled={isPostingComment}>
                        Post Reply
                    </Button>
                </Box>
            )}
            {/* Logic to render replies, if any */}
            {comment.replies && comment.replies.map((reply) => (
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    onReplyClick={onReplyClick}
                    replyTo={replyTo}
                    handlePostComment={handlePostComment}
                    handleSetReplyComment={handleSetReplyComment}
                    replyComments={replyComments}
                    isPostingComment={isPostingComment}
                    depth={depth + 1} // Increase depth for nested replies
                />
            ))}
        </ListItem>
    );
};

export default CommentItem;
