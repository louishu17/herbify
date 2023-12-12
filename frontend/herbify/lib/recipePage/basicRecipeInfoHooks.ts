import { BasicRecipeInfo } from "@/pages/api/recipe/[recipeID]/recipeInfo";
import {useQuery, UseQueryResult} from "react-query";
import { useRouter } from "next/router";
import { IngredientsData } from "@/pages/api/recipe/[recipeID]/ingredients";
import { DirectionsData } from "@/pages/api/recipe/[recipeID]/directions";
import { CommentsResponse } from "@/pages/api/recipe/[recipeID]/comments";
import axios from '../../utils/axiosInstance';

const fetchBasicRecipeInfo = async (recipeID : number) : Promise<BasicRecipeInfo> => {
    const response = await axios.get(`/recipe/${recipeID}/basicInfo`, {
        withCredentials: true
    });
    if (response.status < 300) {
        return response.data;
    } else {
        throw new Error("Failed loading recipe");
    }

}

export const useBasicRecipeInfo = (recipeID : number) : UseQueryResult<BasicRecipeInfo> => {
    return useQuery(["fetchingRecipeInfo"+recipeID], () => fetchBasicRecipeInfo(recipeID));
}

const fetchIngredients = async (recipeID : number) : Promise<IngredientsData> => {
    const response = await axios.get(`/recipe/${recipeID}/ingredients`);
    if (response.status < 300) {
        return response.data;
    } else {
        throw new Error("Failed loading ingredients");
    }

}

export const useIngredients = (recipeID : number) : UseQueryResult<IngredientsData> => {
    return useQuery(["fetchingIngredients"+recipeID], () => fetchIngredients(recipeID));
}

const fetchDirections = async (recipeID : number) : Promise<DirectionsData> => {
    const response = await axios.get(`/recipe/${recipeID}/directions`);
    if (response.status < 300) {
        return response.data;
    } else {
        throw new Error("Failed loading directions");
    }
}

export const useDirections = (recipeID : number) : UseQueryResult<DirectionsData> => {
    return useQuery(["fetchingDirections"+recipeID], () => fetchDirections(recipeID));
}



const INVALID_RECIPE_ID = -999999999;
export const useRecipeID = () : number => {
    const router = useRouter();
    const possibleID = router.query.recipeID;
    if (typeof possibleID === 'string'){
        return parseInt(possibleID);
    } else {
        return INVALID_RECIPE_ID;
    }

}