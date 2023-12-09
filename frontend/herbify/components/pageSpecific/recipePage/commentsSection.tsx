import React, { useState } from "react";
import { useComments, usePostComment } from "@/lib/recipePage/commentRecipeHooks";
import { Typography, Container, List, ListItem, TextField, Button, Box, Link } from "@mui/material";
import { HerbifyLoadingCircle } from "@/components/shared/loading";
import { useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";

const CommentsBody: React.FC = () => {
    const recipeID = useRecipeID();
    const { data: commentsResponse, isLoading, isError, refetch } = useComments(recipeID);
    const { mutate: postComment, isLoading: isPostingComment } = usePostComment({ onSuccess: () => refetch() });

    const [newComment, setNewComment] = useState("");
    const [replyComments, setReplyComments] = useState<{ [key: number]: string }>({});
    const [replyTo, setReplyTo] = useState<number | null>(null);

    const handlePostComment = (parentID?: number) => {
        const commentText = parentID ? replyComments[parentID] : newComment;
        if (commentText) {
            postComment({ recipeID, text: commentText, parentID });
            if (parentID) {
                setReplyComments({ ...replyComments, [parentID]: '' }); // Reset the specific reply field
            } else {
                setNewComment(""); // Reset the main comment field
            }
            setReplyTo(null); // Reset the reply state
        }
    };

    const handleSetReplyComment = (commentId: number, text: string) => {
        setReplyComments({ ...replyComments, [commentId]: text });
    };

    const renderComments = (comments: any[], depth: number = 0) => {
        return (
            <List sx={{ pl: depth > 0 ? 2 : 0 }}>
                {comments.map((comment) => (
                    <React.Fragment key={comment.id}>
                        <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Box sx={{ mb: 1 }}>
                                {/* Display the user's name as a link to their profile */}
                                <Typography style={{ fontSize: '0.75rem' }}>User {comment.user_id}:</Typography>
                                <Typography variant="body1">{comment.text}</Typography>
                                <Button 
                                    size="small" 
                                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}>
                                    {replyTo === comment.id ? 'Cancel' : 'Reply'}
                                </Button>
                            </Box>
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
                            {/* Render replies recursively */}
                            {comment.replies && renderComments(comment.replies, depth + 1)}
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>
        );
    };

    if (isLoading) {
        return <HerbifyLoadingCircle />;
    } else if (isError) {
        return <Typography>An error occurred while loading the comments</Typography>;
    } else if (commentsResponse?.comments) {
        return (
            <Container maxWidth="md">
                {renderComments(commentsResponse.comments)}
                <TextField
                    label="New Comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    fullWidth
                    multiline
                />
                <Button onClick={() => handlePostComment()} disabled={isPostingComment}>
                    Post Comment
                </Button>
            </Container>
        );
    } else {
        return null;
    }
}

export const CommentsSection: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3">Comments</Typography>
            <CommentsBody />
        </Container>
    );
}
