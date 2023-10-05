// pages/api/image.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function pictureAPI(req: NextApiRequest, res: NextApiResponse) {
    setTimeout(() => {
        let { recipeID } = req.query;
        if (typeof recipeID === 'string' && parseInt(recipeID) > 4){
            recipeID = '4';

        }

        // Construct the path to the image
        const imagePath = path.join(process.cwd(), 'public',`Pic${recipeID}.jpg`); // Adjust the path and file extension as needed

        // Check if the file exists
        if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Image not found' + recipeID });
        }

        // Read the file and send it in the response
        const fileStream = fs.createReadStream(imagePath);
        res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content type (e.g., image/jpeg)
        fileStream.pipe(res);
    }, Math.random() * 5000)
    
};
