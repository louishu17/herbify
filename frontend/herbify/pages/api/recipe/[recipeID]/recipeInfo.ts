// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export interface BasicRecipeInfo{
    title : string;
    author : string;
    dateCreated : Date;
    cookTime : number;
}



export default function getBasicRecipeInfo(req: NextApiRequest, res: NextApiResponse<BasicRecipeInfo>) {
    setTimeout(() => {
        res.status(200).json({
            title : "Cool Recipe ",
            author : "Keith Cressman",
            dateCreated : new Date(2023, 5, 1, 0, 39),
            cookTime : 30
        })

    }, 100);

}
