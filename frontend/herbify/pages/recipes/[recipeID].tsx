// @ts-nocheck
import { BaseHerbifyLayout } from "@/components/shared/layouts/baseLayout";
import { useRouter } from "next/router";
import { useBasicRecipeInfo, useRecipeID} from "@/lib/recipePage/basicRecipeInfoHooks";
import { useLikeRecipe, useUnlikeRecipe } from "@/lib/recipePage/likeRecipeHooks";
import { BasicRecipeInfo } from "../api/recipe/[recipeID]/recipeInfo";
import { RecipeHeader } from "../../components/pageSpecific/recipePage/RecipeHeader";
import {Box, Container} from "@mui/material"
import { IngredientsSection } from "@/components/pageSpecific/recipePage/ingredientsSection";
import { DirectionsSection } from "@/components/pageSpecific/recipePage/directionsSection";
import { PictureSection } from "@/components/pageSpecific/recipePage/pictureSection";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useEffect, useState } from "react";
import { CommentsSection } from "@/components/pageSpecific/recipePage/commentsSection";
import { usePostRating } from "@/lib/recipePage/ratingRecipeHooks";
import { RatingComponent } from "@/components/pageSpecific/recipePage/ratingComponent";
import { LikesComponent } from "@/components/pageSpecific/recipePage/likesComponent";
import { useAuth } from "@/lib/authContext";

export default function RecipePage() {
    const { isAuthenticated } = useAuth();
    const recipeID = useRecipeID();
    const {data, isLoading, isError} = useBasicRecipeInfo(recipeID);
    const { mutate: like } = useLikeRecipe();
    const { mutate: unlike } = useUnlikeRecipe();
    const { mutate: rate } = usePostRating(recipeID);
  
    const [userLiked, setUserLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        if (data) {
            setUserLiked(data.userLiked);
            setLikes(data.numLikes);
            setUserRating(data.userRated);
        }
    }, [data]);

    const handleLikeClick = () => {
        if (userLiked) {
            // User has already liked the recipe, so unlike it
            unlike(recipeID, {
                onSuccess: () => {
                    setUserLiked(false);
                    setLikes(likes => likes - 1);
                }
            });
        } else {
            // User hasn't liked the recipe, so like it
            like(recipeID, {
                onSuccess: () => {
                    setUserLiked(true);
                    setLikes(likes => likes + 1);
                }
            });
        }
    };

    const handleRatingChange = (newRating: number) => {
        rate({ rating: newRating }, {
            onSuccess: () => {
                setUserRating(newRating);
            }
        });
    };
    
    if(!isAuthenticated){
        return null;
    }
    
    return (
        <BaseHerbifyLayout>
            <Container maxWidth="lg" sx={{ my: 4 }}> {/* Margin top and bottom */}
            
                <RecipeHeader />

                {/* Centering Picture Section */}
                <Box display="flex" justifyContent="center" alignItems="center" gap={4} my={2}> {/* Margin top and bottom */}
                    <PictureSection />
                </Box>

                {/* Likes and Rating Components */}
                <Box display="flex" justifyContent="center" alignItems="center" gap={4} my={2}>
                    <LikesComponent 
                        userLiked={userLiked} 
                        likesCount={likes} 
                        onLikeClick={handleLikeClick} 
                        isLoading={isLoading} 
                    />
                    <RatingComponent 
                        userRating={userRating} 
                        onRatingChange={handleRatingChange} 
                    />
                </Box>

                {/* Ingredients and Directions Sections */}
                <Box bgcolor="#FFFAF7" p={2} borderRadius={2}>
                    <IngredientsSection />
                </Box>
                <Box bgcolor="#FFFAF7" p={2} borderRadius={2}>
                    <DirectionsSection />
                </Box>

                {/* Comments Section */}
                <Box my={2}> {/* Margin top and bottom */}
                    <CommentsSection />
                </Box>
            </Container>
        </BaseHerbifyLayout>
    );
}


