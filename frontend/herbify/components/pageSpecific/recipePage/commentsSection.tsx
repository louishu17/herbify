import React, { useEffect, useState } from "react";
import { useComments, usePostComment } from "@/lib/recipePage/commentRecipeHooks";
import { Typography, Container, List, ListItem, TextField, Button, Box, Link, Avatar } from "@mui/material";
import { HerbifyLoadingCircle } from "@/components/shared/loading";
import { useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import { useImageForProfilePic, INVALID_S3_FILENAME } from "@/lib/profilePicHooks";
import CommentItem, { commentItem } from "@/components/pageSpecific/recipePage/commentItem";


const CommentsBody: React.FC = () => {
    const recipeID = useRecipeID();
    const { data: commentsResponse, isLoading, isError, refetch } = useComments(recipeID);
    const { mutate: postComment, isLoading: isPostingComment } = usePostComment({ onSuccess: () => refetch() });

    const [commentsWithPics, setCommentsWithPics] = useState<any[]>([]);

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
    
    const renderComments = (comments: any[], depth: number = 0) => {
        return (
            <List sx={{ pl: depth > 0 ? 2 : 0 }}>
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReplyClick={(commentId: number) => setReplyTo(replyTo === commentId ? null : commentId)}
                        replyTo={replyTo}
                        handlePostComment={handlePostComment}
                        handleSetReplyComment={handleSetReplyComment}
                        replyComments={replyComments}
                        isPostingComment={isPostingComment}
                        depth={depth}
                    />
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