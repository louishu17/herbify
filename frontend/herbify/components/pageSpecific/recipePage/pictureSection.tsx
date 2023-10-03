import React from "react";

import { useImageForRecipe } from "@/lib/imageHooks";
import { useRecipeID } from "@/lib/recipePage/basicRecipeInfoHooks";
import Image from "next/image";
import { HerbifyLoadingCircle } from "@/components/shared/loading";
import {Typography} from "@mui/material"
export const PictureSection : React.FC = () => {
    const recipeID = useRecipeID();
    const {data : imageSrc, isLoading, isError} = useImageForRecipe(recipeID);
    if (imageSrc) {
        return (
            <Image src={imageSrc ? imageSrc : ""} alt="pic" width={250} height={200} ></Image>
        );
    } else if (isLoading) {
        return <HerbifyLoadingCircle/>
    } else if (isError) {
        return <Typography>Could not load picture</Typography>
    } else {
        return null;
    }
}

