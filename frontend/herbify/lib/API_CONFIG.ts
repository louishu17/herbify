import AWS from "aws-sdk"

export const API_ROUTE = "http://localhost:5000/";

// Initialize the AWS SDK
AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY,
    region: 'us-east-1'
});
  
// Create an S3 object
export const s3 = new AWS.S3();

  