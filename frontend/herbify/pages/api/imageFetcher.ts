// pages/api/getImage.ts
import { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';

// Initialize the AWS SDK
AWS.config.update({
    accessKeyId: "AKIAU27D2SNFLZ2WDDOD",
    secretAccessKey: "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",
    region: 'us-east-1'
});
  
const s3 = new AWS.S3();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { imageS3Filename } = req.body;
    if (!imageS3Filename) {
        return res.status(400).json({ error: 'Filename is required in the request body.' });
    }
    const params = {
        Bucket: 'herbify-images',
        Key: imageS3Filename,
        Expires: 3600, // URL expiration time in seconds (adjust as needed)
    };
    try {
        const signedUrl = await s3.getSignedUrlPromise('getObject', params);
        res.status(200).json({ signedUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default handler;
