// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export interface FeedData{
    descriptions : RecipeInfoFromFeed[];
}

export interface RecipeInfoFromFeed {
    id : number;
    title : string;
    caption : string;
}

export default function getFeedRecipeIDs(req: NextApiRequest, res: NextApiResponse<FeedData>) {
    setTimeout(() => {
        res.status(200).json({descriptions : [
            {id : 1, title: "Pasta", caption: "Yum!"},
            {id : 2, title: "Linguini", caption: "Delicious!"}, 
            {id : 3, title: "Herb special", caption: "Yum!"}, 
            {id : 4, title: "Louis special", caption: "Louis better than Herb"}
        ]})

    }, 5200);

}
