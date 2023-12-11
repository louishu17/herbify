import { useMutation } from 'react-query';
import axios from '../../utils/axiosInstance';

const likeRecipe = async (recipeId: string) => {
    try {
        const response = await axios.post('/like-recipe', { recipeID: recipeId }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        
        return response.data;
    } catch (error) {
        console.error('Error in likeRecipeAPI:', error);
        throw new Error('Error in liking the recipe');
    }
}

const unlikeRecipe = async (recipeId: string) => {
    try {
        const response = await axios.post('/unlike-recipe', { recipeID: recipeId }, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error('Error in unlikeRecipeAPI:', error);
        throw new Error('Error in unliking the recipe');
    }
}
export const useLikeRecipe = () => {
    return useMutation(likeRecipe, {
        
    });
};

export const useUnlikeRecipe = () => {
    return useMutation(unlikeRecipe, {
        // Optionally add onSuccess, onError, etc.
    });
};