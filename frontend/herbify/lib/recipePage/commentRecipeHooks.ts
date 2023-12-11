import { CommentsResponse } from "@/pages/api/recipe/[recipeID]/comments";
import { PostCommentData } from "@/pages/api/recipe/[recipeID]/postComment";
import axios from '../../utils/axiosInstance';

import {useQuery, UseQueryResult, useMutation, UseMutationResult, UseMutationOptions} from "react-query";

const fetchComments = async (recipeID : number) : Promise<CommentsResponse> => {
    try {
        const response = await axios.get(`/recipe/${recipeID}/comments`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed loading comments");
    }
}


export const useComments = (recipeID : number) : UseQueryResult<CommentsResponse> => {
    return useQuery(["fetchingComments"+recipeID], () => fetchComments(recipeID));
}


const postComment = async (commentData: PostCommentData): Promise<void> => {
    try {
        await axios.post('/comment', commentData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
    } catch (error) {
        throw new Error('Network response was not ok');
    }
}

export const usePostComment = (options?: UseMutationOptions<void, unknown, PostCommentData, unknown>): UseMutationResult<void, unknown, PostCommentData, unknown> => {
    return useMutation(postComment, options);
}

