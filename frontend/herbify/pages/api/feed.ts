// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export interface FeedData{
    descriptions : RecipeInfoFromFeed[];
}

export interface RecipeInfoFromFeed {
    id : number;
    title : string;
}

export default function getFeedRecipeIDs(req: NextApiRequest, res: NextApiResponse<FeedData>) {
    setTimeout(() => {
        res.status(200).json({descriptions : [
            {id : 1, title: "Pasta"},
            {id : 2, title : "Linguini"}, 
            {id : 3, title : "Herb special"}, 
            {id : 4, title : "Louis special"}
        ]})

    }, 200);

}
