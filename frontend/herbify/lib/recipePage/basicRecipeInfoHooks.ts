import { BasicRecipeInfo } from "@/pages/api/recipe/[recipeID]/recipeInfo";
import {useQuery, UseQueryResult} from "react-query";
import { useRouter } from "next/router";
import { IngredientsData } from "@/pages/api/recipe/[recipeID]/ingredients";
import { DirectionsData } from "@/pages/api/recipe/[recipeID]/directions";

const fetchBasicRecipeInfo = async (recipeID : number) : Promise<BasicRecipeInfo> => {
    let route = 'http://127.0.0.1:5000/recipe/' + recipeID + '/basicInfo';
    const response = await fetch(route,{
        credentials: 'include'  // Include cookies with the request
    });
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed loading recipe");
    }

}

export const useBasicRecipeInfo = (recipeID : number) : UseQueryResult<BasicRecipeInfo> => {
    return useQuery(["fetchingRecipeInfo"+recipeID], () => fetchBasicRecipeInfo(recipeID));
}

const fetchIngredients = async (recipeID : number) : Promise<IngredientsData> => {
    let route = 'http://127.0.0.1:5000/recipe/' + recipeID + '/ingredients';
    const response = await fetch(route);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed loading ingredients");
    }

}

export const useIngredients = (recipeID : number) : UseQueryResult<IngredientsData> => {
    return useQuery(["fetchingIngredients"+recipeID], () => fetchIngredients(recipeID));
}

const fetchDirections = async (recipeID : number) : Promise<DirectionsData> => {
    let route = 'http://127.0.0.1:5000/recipe/' + recipeID + '/directions';
    const response = await fetch(route);
    if (response.ok) {
        return response.json();
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