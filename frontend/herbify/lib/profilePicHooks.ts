import {useQuery, useQueryClient, UseQueryResult} from "react-query";
import { s3 } from "./API_CONFIG";




const fetchPictureForPiclessProfile = async () : Promise<string> => {
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
export const DEFAULT_PROFILE_FILENAME = "profilePics/ProfilePic.jpg";

const fetchS3ProfilePic = async (imageS3Filename : string) : Promise<string> => {
    const params = {
        Bucket: 'herbify-images',
        Key: imageS3Filename,
        Expires: 3600, // URL expiration time in seconds (adjust as needed)
    };
    return s3.getSignedUrlPromise('getObject', params);
}


export const useImageForProfilePic = (profilePicS3Filename : string) : UseQueryResult<string> => {

    return useQuery(["fetchingProfilePic"+profilePicS3Filename], () => {
        if (profilePicS3Filename && profilePicS3Filename !== INVALID_S3_FILENAME){
            return fetchS3ProfilePic(profilePicS3Filename);
        } else {
            return fetchS3ProfilePic(DEFAULT_PROFILE_FILENAME);
        }
    });
}