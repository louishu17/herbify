// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { INVALID_S3_FILENAME } from '@/lib/imageHooks';
import type { NextApiRequest, NextApiResponse } from 'next'

export interface BasicRecipeInfo{
    title : string;
    author : string;
    dateCreated : Date;
    cookTime : number;
    imageS3Filename : string;
    numLikes: number;
}



export default function getBasicRecipeInfo(req: NextApiRequest, res: NextApiResponse<BasicRecipeInfo>) {
    setTimeout(() => {
        res.status(200).json({
            title : "Cool Recipe ",
            author : "Keith Cressman",
            dateCreated : new Date(2023, 5, 1, 0, 39),
            cookTime : 30,
            imageS3Filename : INVALID_S3_FILENAME,
            numLikes: 0
        })

    }, 100);

}
