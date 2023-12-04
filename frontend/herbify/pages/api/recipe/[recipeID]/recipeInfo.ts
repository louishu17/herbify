// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { INVALID_S3_FILENAME } from '@/lib/recipeImageHooks';
import type { NextApiRequest, NextApiResponse } from 'next'

export interface BasicRecipeInfo{
    title : string;
    postedByUserID : number;
    dateCreated : Date;
    cookTime : number;
    imageS3Filename : string;
    numLikes: number;
    userLiked: boolean;
    userName : string;
    profilePicS3Filename : string;

}



export default function getBasicRecipeInfo(req: NextApiRequest, res: NextApiResponse<BasicRecipeInfo>) {
    setTimeout(() => {
        res.status(200).json({
            title : "Cool Recipe ",
            dateCreated : new Date(2023, 5, 1, 0, 39),
            cookTime : 30,
            imageS3Filename : INVALID_S3_FILENAME,
            numLikes: 0,
            userLiked: false,
            userName : "Tad",
            postedByUserID : 19,
            profilePicS3Filename : "profilePics/ProfilePic.jpg"
        })

    }, 100);

}
