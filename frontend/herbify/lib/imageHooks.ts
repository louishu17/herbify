import {useQuery, UseQueryResult} from "react-query";

const fetchImageForRecipe = async (recipeID : number) : Promise<string> => {
    let route = '/api/recipe/' + recipeID + '/picture';
    const response = await fetch(route);
    if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    } else {
        throw new Error("Failed loading image");
    }

}

export const useImageForRecipe = (recipeID : number) : UseQueryResult<string> => {
    return useQuery(["fetchingImg"+recipeID], () => fetchImageForRecipe(recipeID));
}