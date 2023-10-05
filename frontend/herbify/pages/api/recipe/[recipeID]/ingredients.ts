// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export interface IngredientsData{
  ingredients : string[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IngredientsData>
) {
  setTimeout(() => {
    res.status(200).json({ ingredients: ['pasta', 'sauce', 'salt'] })
  }, Math.random() * 500);
  
}
