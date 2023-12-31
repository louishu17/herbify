// pages/api/image.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';


export default function pictureForImagelessRecipe(req: NextApiRequest, res: NextApiResponse) {

    // Construct the path to the image
    const imagePath = path.join(process.cwd(), 'public',`PicForImagelessRecipe.jpg`); // Adjust the path and file extension as needed

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: 'Image not found' });
    }

    // Read the file and send it in the response
    const fileStream = fs.createReadStream(imagePath);
    res.setHeader('Content-Type', 'image/jpeg'); // Set the appropriate content type (e.g., image/jpeg)
    fileStream.pipe(res);

    
};
