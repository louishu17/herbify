import React from "react";
import { RecipeOnProfileData } from "@/lib/profileHooks";
import { useImageForRecipe } from "@/lib/recipeImageHooks";
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import { RecipeOnFeed } from "../feed/recipeOnFeed";

interface RecipeOnProfileProps {
    recipeSpecificData : RecipeOnProfileData;
    profilePicS3Filename : string;
}
export const RecipeOnProfile : React.FC<RecipeOnProfileProps> = (props : RecipeOnProfileProps) => {
    return (

        <RecipeOnFeed info={{
            recipeID : props.recipeSpecificData.recipeID, 
            imageS3Filename : props.recipeSpecificData.imageS3Filename, 
            caption : props.recipeSpecificData.caption, 
            title : props.recipeSpecificData.title, 
            profilePicS3Filename : props.profilePicS3Filename,
            postedByUserID : props.recipeSpecificData.postedByUserID,
            
        }} isProfile = {true} ></RecipeOnFeed>

    )
}