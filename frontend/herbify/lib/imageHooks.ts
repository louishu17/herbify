import {useQuery, useQueryClient, UseQueryResult} from "react-query";
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

const fetchPictureForImagelessRecipe = async () : Promise<string> => {
    let route = '/api/recipe/1/pictureForImagelessRecipe';
    const response = await fetch(route);
    if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    } else {
        throw new Error("Failed loading image");
    }
}

export const INVALID_S3_FILENAME = "none";

const fetchS3ImageForRecipe = async (imageS3Filename : string) : Promise<string> => {
    const params = {
        Bucket: 'herbify-images',
        Key: imageS3Filename,
        Expires: 3600, // URL expiration time in seconds (adjust as needed)
    };
    return s3.getSignedUrlPromise('getObject', params);
}


export const useImageForRecipe = (imageS3Filename : string) : UseQueryResult<string> => {

    return useQuery(["fetchingImg"+imageS3Filename], () => {
        if (imageS3Filename && imageS3Filename != "none"){
            return fetchS3ImageForRecipe(imageS3Filename);
        } else {
            return fetchPictureForImagelessRecipe();
        }
    });
}