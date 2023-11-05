import {useQuery, UseQueryResult} from "react-query";
import { s3 } from "./API_CONFIG";


const fetchMockImageForRecipe = async (recipeID : number) : Promise<string> => {
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


const fetchS3ImageForRecipe = async (recipeID : number) : Promise<string> => {
    const params = {
        Bucket: 'herbify-images',
        Key: 'Pic1.jpg',
        Expires: 3600, // URL expiration time in seconds (adjust as needed)
    };
    return s3.getSignedUrlPromise('getObject', params);
}


export const useImageForRecipe = (recipeID : number) : UseQueryResult<string> => {
    return useQuery(["fetchingImg"+recipeID], () => fetchS3ImageForRecipe(recipeID), {staleTime: 10000});
}