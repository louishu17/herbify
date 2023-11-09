import React from "react";
import { RecipeOnProfileData } from "@/lib/profileHooks";
import { useImageForRecipe } from "@/lib/imageHooks";
import { Grid, Paper, Typography, Box, Avatar } from '@mui/material';
import { RecipeOnFeed } from "../feed/recipeOnFeed";

interface RecipeOnProfileProps {
    data : RecipeOnProfileData;
}
export const RecipeOnProfile : React.FC<RecipeOnProfileProps> = (props : RecipeOnProfileProps) => {
    return (

                    <RecipeOnFeed info={{id : props.data.recipeID, imageS3Filename : props.data.imageS3Filename, caption : props.data.caption, title : props.data.title}}></RecipeOnFeed>

    )
}