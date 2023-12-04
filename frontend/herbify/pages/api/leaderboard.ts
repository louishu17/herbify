// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { INVALID_S3_FILENAME } from '@/lib/recipeImageHooks';

export interface LeaderboardAPIData{
    leaders : LeaderOnLeaderboardData[];
}

export interface LeaderOnLeaderboardData {
    uid : number;
    name : string;
    numberOfFollowers : number;
    profilePicS3Filename : string;
}



export default function getLeaderboard(req: NextApiRequest, res: NextApiResponse<LeaderboardAPIData>) {
    setTimeout(() => {
        res.status(200).json({ leaders: [
            { uid: 1, name : "Keith", numberOfFollowers : 72, profilePicS3Filename : "profilePics/ProfilePic.jpg"},
            { uid: 2, name : "Louis", numberOfFollowers : 50, profilePicS3Filename : "profilePics/ProfilePic.jpg"},
            { uid: 3, name : "Frankie", numberOfFollowers : 23, profilePicS3Filename : "profilePics/ProfilePic.jpg"},
            { uid: 4, name : "Herb", numberOfFollowers : 1, profilePicS3Filename : "profilePics/ProfilePic.jpg"},
            { uid: 5, name : "Mike", numberOfFollowers : 0, profilePicS3Filename : "profilePics/ProfilePic.jpg"}
        ]})

    }, 500);

}
