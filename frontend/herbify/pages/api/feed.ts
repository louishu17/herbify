// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { INVALID_S3_FILENAME } from '@/lib/imageHooks';

export interface FeedData{
    descriptions : RecipeInfoFromFeed[];
}

export interface RecipeInfoFromFeed {
    id : number;
    title : string;
    caption : string;
    imageS3Filename : string;
}



export default function getFeedRecipeIDs(req: NextApiRequest, res: NextApiResponse<FeedData>) {
    setTimeout(() => {
        res.status(200).json({descriptions : [
            {id : 1, title: "Pasta", caption: "Yum!", imageS3Filename : INVALID_S3_FILENAME},
            {id : 2, title: "Linguini", caption: "Delicious!", imageS3Filename : INVALID_S3_FILENAME}, 
            {id : 3, title: "Herb special", caption: "Yum!", imageS3Filename : INVALID_S3_FILENAME}, 
            {id : 4, title: "Louis special", caption: "Louis better than Herb", imageS3Filename : INVALID_S3_FILENAME}
        ]})

    }, 200);

}
