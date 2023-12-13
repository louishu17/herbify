import { useRouter } from 'next/router';
import axios from '../utils/axiosInstance';
import { useQuery, UseQueryResult } from 'react-query';
import { useState, useEffect } from 'react';
import { User } from "@/components/pageSpecific/search/searchResultsUser";
import { Recipe } from "@/components/pageSpecific/search/searchResultsRecipe";

const INVALID_USER_ID = -1; // Use a value that makes sense for invalid user ID in your system

export const useUserID = (): number => {
    const router = useRouter();
    const { profileID } = router.query; // Assuming the dynamic route segment is named `userId`
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
    hour : number;
    minute : number;
    profilePicS3Filename : string;
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
    profilePicS3Filename : string;
}

export interface ProfileData {
    followers : number;
    following : number;
    recipes : RecipeOnProfileData[];
    user : UserOnProfileData[];
}


const fetchProfileData = async (userId : number) :  Promise<ProfileData>=> {
    const response = await axios.get(`/profile/${userId}`);
    console.log(response.data.recipes)
    if (response.status > 300){
        throw new Error("Error fetching profile data");
    } 
    return response.data;
}

export const useFetchProfile = (userID : number) : UseQueryResult<ProfileData> => {
    return useQuery<ProfileData>("fetchProfile" + userID, () => fetchProfileData(userID));
}

export const fetchSessionId = async () : Promise<number> => {
    const response = await axios.get(`/curr_session`);
    
    if (response.status > 300){
        throw new Error("Error session id");
    } 
    return response.data.session_id;
};

export const sessionServerSide = async () : Promise<Boolean> => {
    const response = await axios.get(`/session_redirect`);
    
    if (response.status > 300){
        throw new Error("Error session id");
    } 
    return response.data == "True";

};

const fetchFollowStatus = async (profileUserId: number) : Promise<boolean> => {
    if (profileUserId === INVALID_USER_ID) {
        return false;
    }
    const response = await axios.get(`/following/${profileUserId}`);
    
    if (response.status > 300){
        throw new Error("Error follow status");
    } 
    return response.data.is_following;
};

const updateFollowStatus = async (profileUserId: number, newFollowStatus: boolean) => {
    if (newFollowStatus) {
        const response = await axios.post(`/follow/${profileUserId}`);
    }
    else {
        const response = await axios.post(`/unfollow/${profileUserId}`);
    }
    // if (response.status > 300){
    //     throw new Error("Error updating follow status");
    // }
};


export const useFollow = (profileUserId: number, prevNumFollowers: number, setNumFollowers: React.Dispatch<React.SetStateAction<number>>) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Initialize follow status
    // Replace this with your actual logic to check if the user is following
    const checkIfFollowing = async () => {
      const followingStatus = await fetchFollowStatus(profileUserId);
      setIsFollowing(followingStatus);
    };

    checkIfFollowing();
  }, [profileUserId]);

  const toggleFollow = async () => {
    const newFollowStatus = !isFollowing;
    setIsFollowing(newFollowStatus);
    // Update the follow status in the backend
    await updateFollowStatus(profileUserId, newFollowStatus);

    setNumFollowers((prevNumFollowers: number) =>
        newFollowStatus ? prevNumFollowers + 1 : prevNumFollowers - 1
    );

  };

  return { isFollowing, toggleFollow };
};

export const fetchFollowing = async (profileUserId: number) : Promise<User[]> => {
    const response = await axios.get(`/following_users/${profileUserId}`)
    if (response.status > 300){
        throw new Error("Error session id");
    } 
    return response.data.users;
};

export const fetchFollowedBy = async (profileUserId: number) : Promise<User[]> => {
    const response = await axios.get(`/followed_by_users/${profileUserId}`)
    if (response.status > 300){
        throw new Error("Error session id");
    } 
    return response.data.users;
};

export const fetchLiked = async (profileUserId: number) : Promise<Recipe[]> => {
    const response = await axios.get(`/users_liked_by_current/${profileUserId}`)
    if (response.status > 300){
        throw new Error("Error session id");
    } 

    return response.data.recipes;
};

export const fetchRated = async (profileUserId: number) : Promise<Recipe[]> => {
    const response = await axios.get(`/users_rated_by_current/${profileUserId}`)
    if (response.status > 300){
        throw new Error("Error session id");
    } 

    return response.data.recipes;
};