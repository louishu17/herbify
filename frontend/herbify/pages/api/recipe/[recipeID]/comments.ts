// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export interface Comment{
  firstName : string;
  id : number;
  parent_id: number | null;
  post_id: number;
  text: string;
  user_id: number;
  timestamp: string;
  profilePicS3Filename: string;
  replies: Comment[];
}

export interface CommentsResponse {
    comments: Comment[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentsResponse>
) {
  setTimeout(() => {
    res.status(200).json({
        "comments": [
            {
                "firstName": "Louis",
                "id": 1,
                "parent_id": null,
                "post_id": 1,
                "profilePicS3Filename": "profilePics/user-16-848.jpeg",
                "replies": [
                    {
                        "firstName": "Louis",
                        "id": 5,
                        "parent_id": 1,
                        "post_id": 1,
                        "profilePicS3Filename": "profilePics/user-16-848.jpeg",
                        "replies": [],
                        "text": "I LOVE HERBIFY!",
                        "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                        "user_id": 16
                    },
                    {
                        "firstName": "Louis",
                        "id": 14,
                        "parent_id": 1,
                        "post_id": 1,
                        "profilePicS3Filename": "profilePics/user-16-848.jpeg",
                        "replies": [],
                        "text": "I LOVE HERBIFY!",
                        "timestamp": "Sat, 09 Dec 2023 17:36:26 GMT",
                        "user_id": 16
                    }
                ],
                "text": "I LOVE HERBIFY!",
                "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                "user_id": 16
            },
            {
                "firstName": "Louis",
                "id": 2,
                "parent_id": null,
                "post_id": 1,
                "profilePicS3Filename": "profilePics/user-16-848.jpeg",
                "replies": [],
                "text": "I LOVE HERBIFY!",
                "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                "user_id": 16
            },
            {
                "firstName": "Louis",
                "id": 3,
                "parent_id": null,
                "post_id": 1,
                "profilePicS3Filename": "profilePics/user-16-848.jpeg",
                "replies": [],
                "text": "I LOVE HERBIFY!",
                "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                "user_id": 16
            },
            {
                "firstName": "Louis",
                "id": 4,
                "parent_id": null,
                "post_id": 1,
                "profilePicS3Filename": "profilePics/user-16-848.jpeg",
                "replies": [],
                "text": "I LOVE HERBIFY!",
                "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                "user_id": 16
            }
        ]
    })
  }, Math.random() * 500);
  
}
