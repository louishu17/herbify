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
    numRatings : number;
    avgRating : number;
    createdDate : string;
    hour: number;
    minute: number;
    hours : number;
    minutes : number;
    isDairyFree : boolean;
    isGlutenFree : boolean;
    isHealthy : boolean;
    isHighProtein : boolean;
    isKeto : boolean;
    isKidFriendly : boolean;
    isNutFree : boolean;
    isSpicy : boolean;
    isVegan : boolean;
    isVegetarian : boolean;
}



export default function getFeedRecipeIDs(req: NextApiRequest, res: NextApiResponse<FeedData>) {
    setTimeout(() => {
        res.status(200).json({descriptions : [ ]})

    }, 200);

}
