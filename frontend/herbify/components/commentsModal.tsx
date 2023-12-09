import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { List, ListItem, TextField } from '@mui/material';

interface RecipeComment {
    id: number;
    text: string;
    user_id: number;
    timestamp: string;
    replies?: RecipeComment[]; 
}

interface RecipeCommentsModalProps {
    open: boolean;
    handleClose: () => void;
    comments: RecipeComment[];
    onCommentSubmit: (text: string, parentID?: number) => void; // This function includes recipeID implicitly
}

const getRelativeTime = (timestamp: string): string => {
    const postedTime = new Date(timestamp).getTime();
    const currentTime = new Date().getTime();
    const differenceInSeconds = Math.floor((currentTime - postedTime) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    if (differenceInSeconds < minute) {
        return `${differenceInSeconds}s`; // seconds ago
    } else if (differenceInSeconds < hour) {
        return `${Math.floor(differenceInSeconds / minute)}m`; // minutes ago
    } else if (differenceInSeconds < day) {
        return `${Math.floor(differenceInSeconds / hour)}h`; // hours ago
    } else if (differenceInSeconds < week) {
        return `${Math.floor(differenceInSeconds / day)}d`; // days ago
    } else {
        return `${Math.floor(differenceInSeconds / week)}w`; // weeks ago
    }
};


const CommentsModal: React.FC<RecipeCommentsModalProps> = ({ open, handleClose, comments, onCommentSubmit }) => {
    const [mainComment, setMainComment] = useState("");
    const [replyComments, setReplyComments] = useState<{ [key: number]: string }>({});
    const [replyTo, setReplyTo] = useState<number | null>(null);

    const handleMainCommentSubmit = () => {
        if (mainComment.trim()) {
            onCommentSubmit(mainComment);
            setMainComment("");
        }
    };

    const handleReplySubmit = (commentId: number) => {
        const replyText = replyComments[commentId];
        if (replyText?.trim()) {
            onCommentSubmit(replyText, commentId);
            setReplyComments({ ...replyComments, [commentId]: '' });
            setReplyTo(null);
        }
    };

    const handleSetReplyComment = (commentId: number, text: string) => {
        setReplyComments({ ...replyComments, [commentId]: text });
    };

    const renderComments = (comments: RecipeComment[], depth: number = 0) => {
        return (
            <List sx={{ pl: depth > 0 ? 2 : 0, width: '100%' }}>
                {comments.map((comment) => (
                    <ListItem key={comment.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Box sx={{ mb: 1 }}>
                            <Typography style={{ fontSize: '0.75rem' }}>
                                User {comment.user_id}     
                                <span style={{ marginLeft: '5px', color: 'darkgrey', fontSize: '0.65rem'}}>
                                    {getRelativeTime(comment.timestamp)}
                                </span>
                            </Typography>
                            <Typography variant="body1">{comment.text}</Typography>
                            <Button size="small" onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}>
                                {replyTo === comment.id ? 'Cancel' : 'Reply'}
                            </Button>
                            {replyTo === comment.id && (
                                <Box>
                                    <TextField
                                        label="Reply"
                                        value={replyComments[comment.id] || ''}
                                        onChange={(e) => handleSetReplyComment(comment.id, e.target.value)}
                                        fullWidth
                                        multiline
                                    />
                                    <Button onClick={() => handleReplySubmit(comment.id)}>Post Reply</Button>
                                </Box>
                            )}
                        </Box>
                        {comment.replies && renderComments(comment.replies, depth + 1)}
                    </ListItem>
                ))}
            </List>
        );
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
                    {renderComments(comments)}
                </div>
                <Box>
                    <TextField
                        label="New Comment"
                        value={mainComment}
                        onChange={(e) => setMainComment(e.target.value)}
                        fullWidth
                        multiline
                    />
                    <Button onClick={handleMainCommentSubmit}>Post Comment</Button>
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