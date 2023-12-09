import { CommentsResponse } from "@/pages/api/recipe/[recipeID]/comments";
import { PostCommentData } from "@/pages/api/recipe/[recipeID]/postComment";

import {useQuery, UseQueryResult, useMutation, UseMutationResult, UseMutationOptions} from "react-query";

const fetchComments = async (recipeID : number) : Promise<CommentsResponse> => {
    let route = 'http://127.0.0.1:5000/recipe/' + recipeID + '/comments';
    const response = await fetch(route,
        {
            credentials: 'include'  // Include cookies with the request
        });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed loading comments");
    }
}


export const useComments = (recipeID : number) : UseQueryResult<CommentsResponse> => {
    return useQuery(["fetchingComments"+recipeID], () => fetchComments(recipeID));
}


const postComment = async (commentData: PostCommentData): Promise<void> => {
    let route = 'http://127.0.0.1:5000/comment'
    const response = await fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
}

export const usePostComment = (options?: UseMutationOptions<void, unknown, PostCommentData, unknown>): UseMutationResult<void, unknown, PostCommentData, unknown> => {
    return useMutation(postComment, options);
}

