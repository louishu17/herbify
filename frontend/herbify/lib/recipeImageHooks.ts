import {useQuery, useQueryClient, UseQueryResult} from "react-query";



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
    const response = await fetch('/api/imageFetcher', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageS3Filename }),
    });

    const data = await response.json();
    return data.signedUrl;
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