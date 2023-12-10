import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import CommentItem from './pageSpecific/recipePage/commentItem';

export interface RecipeComment {
    id: number;
    text: string;
    user_id: number;
    timestamp: string;
    profilePicS3Filename?: string;
    firstName?: string;
    replies?: RecipeComment[]; 
}

interface RecipeCommentsModalProps {
    open: boolean;
    handleClose: () => void;
    comments: RecipeComment[];
    onCommentSubmit: (text: string, parentID?: number) => void; // This function includes recipeID implicitly
}

const CommentsModal: React.FC<RecipeCommentsModalProps> = ({ open, handleClose, comments, onCommentSubmit }) => {
    const [mainComment, setMainComment] = useState("");
    const [replyComments, setReplyComments] = useState<{ [key: number]: string }>({});
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [isPostingComment, setIsPostingComment] = useState(false); // State to manage posting status

    const handleMainCommentSubmit = () => {
        if (mainComment.trim()) {
            setIsPostingComment(true); // Set posting status
            onCommentSubmit(mainComment);
            setMainComment("");
            setIsPostingComment(false); // Reset posting status
        }
    };

    const handleReplySubmit = (commentId: number) => {
        const replyText = replyComments[commentId];
        if (replyText?.trim()) {
            setIsPostingComment(true); // Set posting status
            onCommentSubmit(replyText, commentId);
            setReplyComments({ ...replyComments, [commentId]: '' });
            setReplyTo(null);
            setIsPostingComment(false); // Reset posting status
        }
    };

    const handleSetReplyComment = (commentId: number, text: string) => {
        setReplyComments({ ...replyComments, [commentId]: text });
    };

    const handleReplyClick = (commentId: number) => {
        setReplyTo(replyTo === commentId ? null : commentId);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="comments-modal-title"
            aria-describedby="comments-modal-description"
        >
            <Box sx={style}>
                <Typography id="comments-modal-title" variant="h6" component="h2">
                    Comments
                </Typography>
                <div id="comments-modal-description">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onReplyClick={handleReplyClick}
                            replyTo={replyTo}
                            handlePostComment={handleReplySubmit}
                            handleSetReplyComment={handleSetReplyComment}
                            replyComments={replyComments}
                            isPostingComment={isPostingComment}
                        />
                    ))}
                </div>
                <Box>
                    <TextField
                        label="New Comment"
                        value={mainComment}
                        onChange={(e) => setMainComment(e.target.value)}
                        fullWidth
                        multiline
                    />
                    <Button onClick={handleMainCommentSubmit} disabled={isPostingComment}>Post Comment</Button>
                </Box>
                <Button onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
            </Box>
        </Modal>
    );
}

// Style for the modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600, // Adjusted for better readability
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    maxHeight: '80%',
};

export default CommentsModal;
