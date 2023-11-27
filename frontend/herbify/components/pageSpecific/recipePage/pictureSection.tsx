import React from "react";

import { useImageForRecipe } from "@/lib/imageHooks";
import { useBasicRecipeInfo, useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import Image from "next/image";
import { HerbifyLoadingCircle } from "@/components/shared/loading";
import {Typography} from "@mui/material"
export const PictureSection : React.FC = () => {
    const recipeID = useRecipeID();
    const {data : recipeData, isLoading : isLoadingRecipeData, isError : isErrorWithRecipeData} = useBasicRecipeInfo(recipeID);
    let imageS3Filename = recipeData ? recipeData.imageS3Filename : "none";
    const {data : imageSrc, isLoading : isLoadingImg, isError : isErrorWithImg} = useImageForRecipe(imageS3Filename)
    if (!isLoadingRecipeData && imageSrc) {
        return (
            <Image src={imageSrc ? imageSrc : ""} alt="pic" width={250} height={200} ></Image>
        );
    } else if (isLoadingRecipeData || isLoadingImg) {
        return <HerbifyLoadingCircle/>
    } else if (isErrorWithRecipeData || isErrorWithImg) {
        return <Typography>Could not load picture</Typography>
    } else {
        return null;
    }
}

