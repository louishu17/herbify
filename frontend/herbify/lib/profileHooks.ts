import { useRouter } from 'next/router';
import axios from 'axios';
import { useQuery, UseQueryResult } from 'react-query';

const INVALID_USER_ID = -1; // Use a value that makes sense for invalid user ID in your system

export const useUserID = (): number => {
    const router = useRouter();
    const { profileID } = router.query; // Assuming the dynamic route segment is named `userId`
    console.log(profileID);
    if (typeof profileID === 'string' && /^\d+$/.test(profileID)) {
        return parseInt(profileID);
    } else {
        return INVALID_USER_ID;
    }
};

export interface RecipeOnProfileData{
    caption : string;
    createdDate : string;
    imageS3Filename : string;
    postedByUserID : number;
    recipeID : number;
    title : string;
}

export interface UserOnProfileData {
    bio : string;
    creationDate : string;
    dateOfBirth : string;
    email : string;
    firstName : string;
    lastName : string;
    middleName : string;
    phoneNumber : string;
    pronouns : string;
    suffix : string;
    uid : number;
}

export interface ProfileData {
    followers : number;
    following : number;
    recipes : RecipeOnProfileData[];
    user : UserOnProfileData[];
}

const fetchProfileData = async (userId : number) :  Promise<ProfileData>=> {
    const response = await axios.get(`http://127.0.0.1:5000/profile/${userId}`, {withCredentials: true});
    if (response.status > 300){
        throw new Error("Error fetching feed");
    } 
    return response.data;
}

export const useFetchProfile = (userID : number) : UseQueryResult<ProfileData> => {
    return useQuery<ProfileData>("fetchProfile" + userID, () => fetchProfileData(userID));
}