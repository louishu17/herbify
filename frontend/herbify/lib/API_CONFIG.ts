import AWS from "aws-sdk"

export const API_ROUTE = "http://localhost:5000/";

// Initialize the AWS SDK
AWS.config.update({
    accessKeyId: 'AKIAU27D2SNFLJFMFZV6',
    secretAccessKey: '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',
    region: 'us-east-1'
});
  
// Create an S3 object
export const s3 = new AWS.S3();

  
