// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export interface Comment{
  id : number;
  parent_id: number | null;
  post_id: number;
  text: string;
  user_id: number;
  timestamp: string;
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
                "id": 1,
                "parent_id": null,
                "post_id": 1,
                "replies": [
                    {
                        "id": 5,
                        "parent_id": 1,
                        "post_id": 1,
                        "replies": [],
                        "text": "I LOVE HERBIFY!",
                        "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                        "user_id": 16
                    },
                    {
                        "id": 14,
                        "parent_id": 1,
                        "post_id": 1,
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
                "id": 2,
                "parent_id": null,
                "post_id": 1,
                "replies": [],
                "text": "I LOVE HERBIFY!",
                "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                "user_id": 16
            },
            {
                "id": 3,
                "parent_id": null,
                "post_id": 1,
                "replies": [],
                "text": "I LOVE HERBIFY!",
                "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                "user_id": 16
            },
            {
                "id": 4,
                "parent_id": null,
                "post_id": 1,
                "replies": [],
                "text": "I LOVE HERBIFY!",
                "timestamp": "Sat, 09 Dec 2023 17:28:25 GMT",
                "user_id": 16
            }
        ]
    })
  }, Math.random() * 500);
  
}
