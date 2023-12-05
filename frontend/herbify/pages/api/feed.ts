// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { INVALID_S3_FILENAME } from '@/lib/recipeImageHooks';

export interface FeedData{
    descriptions : RecipeInfoFromFeed[];
}

export interface RecipeInfoFromFeed {
    recipeID : number;
    title : string;
    caption : string;
    imageS3Filename : string;
    numLikes: number;
    userLiked: boolean;
    postedByUserID : number;
    nameOfPoster : string;
    profilePicS3Filename : string;
    
}



export default function getFeedRecipeIDs(req: NextApiRequest, res: NextApiResponse<FeedData>) {
    setTimeout(() => {
        res.status(200).json({descriptions : [
            {recipeID : 1, title: "Pasta", caption: "Yum!", imageS3Filename : INVALID_S3_FILENAME, numLikes: 0, userLiked: false, postedByUserID : 19, nameOfPoster: "Taddy", profilePicS3Filename : "profilePics/profilePic.jpg"},
            {recipeID : 2, title: "Linguini", caption: "Delicious!", imageS3Filename : INVALID_S3_FILENAME, numLikes: 0, userLiked: false, postedByUserID : 19, nameOfPoster: "Taddy", profilePicS3Filename : "profilePics/profilePic.jpg"}, 
            {recipeID : 3, title: "Herb special", caption: "Yum!", imageS3Filename : INVALID_S3_FILENAME, numLikes: 0, userLiked: false, postedByUserID : 19, nameOfPoster: "Taddy", profilePicS3Filename : "profilePics/profilePic.jpg"}, 
            {recipeID : 4, title: "Louis special", caption: "Louis better than Herb", imageS3Filename : INVALID_S3_FILENAME, numLikes: 0, userLiked: false, postedByUserID : 19, nameOfPoster: "Taddy", profilePicS3Filename : "profilePics/profilePic.jpg"},
        ]})

    }, 200);

}
