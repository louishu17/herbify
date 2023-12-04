// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { INVALID_S3_FILENAME } from '@/lib/imageHooks';

export interface LeaderboardAPIData{
    leaders : LeaderOnLeaderboardData[];
}

export interface LeaderOnLeaderboardData {
    uid : number;
    name : string;
    numberOfFollowers : number;
}



export default function getLeaderboard(req: NextApiRequest, res: NextApiResponse<LeaderboardAPIData>) {
    setTimeout(() => {
        res.status(200).json({ leaders: [
            { uid: 1, name : "Keith", numberOfFollowers : 72},
            { uid: 2, name : "Louis", numberOfFollowers : 50},
            { uid: 3, name : "Frankie", numberOfFollowers : 23},
            { uid: 4, name : "Herb", numberOfFollowers : 1},
            { uid: 5, name : "Mike", numberOfFollowers : 0}
        ]})

    }, 500);

}
