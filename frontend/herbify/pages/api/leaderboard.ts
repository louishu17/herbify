// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { INVALID_S3_FILENAME } from '@/lib/imageHooks';

export interface LeaderboardAPIData{
    leaders : LeaderOnLeaderboardData[];
}

export interface LeaderOnLeaderboardData {
    name : string;
    numberOfLikes : number;
}



export default function getLeaderboard(req: NextApiRequest, res: NextApiResponse<LeaderboardAPIData>) {
    setTimeout(() => {
        res.status(200).json({ leaders: [
            { name : "Keith", numberOfLikes : 72},
            { name : "Louis", numberOfLikes : 50},
            { name : "Frankie", numberOfLikes : 23},
            { name : "Herb", numberOfLikes : 1},
            { name : "Mike", numberOfLikes : 0}
        ]})

    }, 500);

}
