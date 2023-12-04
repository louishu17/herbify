import { useMutation } from 'react-query';

const likeRecipe = async (recipeId: string) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/like-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeID: recipeId }),
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error('Error in liking the recipe');
        }

        return response.json();
    } catch (error) {
        console.error('Error in likeRecipeAPI:', error);
    }
}

const unlikeRecipe = async (recipeId: string) => {
    try {
        const response = await fetch('http://127.0.0.1:5000/unlike-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeID: recipeId }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error in unliking the recipe');
        }

        return response.json();
    } catch (error) {
        console.error('Error in unlikeRecipeAPI:', error);
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