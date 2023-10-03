// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export interface DirectionsData{
  directions : string[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DirectionsData>
) {
  setTimeout(() => {
    res.status(200).json({ directions: ['heat the water on the stove until it boils', 'throw the pasta in', 'wait until it is cooked', 'eat it' ]})
  }, Math.random() * 500);
  
}
