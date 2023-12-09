

import {useMutation, UseMutationResult, UseMutationOptions} from "react-query";
import { PostRatingData } from "@/pages/api/recipe/[recipeID]/ratings";

const postRating = async (ratingData: PostRatingData, recipeID : number): Promise<void> => {
    let route = 'http://127.0.0.1:5000/recipe/' + recipeID + '/rate-recipe'
    const response = await fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
}

export const usePostRating = (recipeID : number, options?: UseMutationOptions<void, unknown, PostRatingData, unknown>): UseMutationResult<void, unknown, PostRatingData, unknown> => {
    return useMutation((ratingData : PostRatingData) => postRating(ratingData, recipeID), options);
}