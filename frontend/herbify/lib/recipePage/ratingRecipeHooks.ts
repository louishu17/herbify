

import {useMutation, UseMutationResult, UseMutationOptions} from "react-query";
import { PostRatingData } from "@/pages/api/recipe/[recipeID]/ratings";
import axios from '../../utils/axiosInstance';

const postRating = async (ratingData: PostRatingData, recipeID: number): Promise<void> => {
    try {
        await axios.post(`/recipe/${recipeID}/rate-recipe`, ratingData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
    } catch (error) {
        console.error('Error in postRatingAPI:', error);
        throw new Error('Network response was not ok');
    }
}

export const usePostRating = (recipeID : number, options?: UseMutationOptions<void, unknown, PostRatingData, unknown>): UseMutationResult<void, unknown, PostRatingData, unknown> => {
    return useMutation((ratingData : PostRatingData) => postRating(ratingData, recipeID), options);
}