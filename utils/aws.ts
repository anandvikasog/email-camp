import AWS from 'aws-sdk';

// Initialize S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Function to upload the file buffer to S3
export const uploadToS3 = async (buffer: Buffer, key: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: `${key}.jpg`,
    Body: buffer,
    ContentType: 'image/jpeg',
  };

  try {
    // Upload the file to S3
    const data = await s3.upload(params).promise();
    return data.Location; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Error uploading file to S3');
  }
};

// Function to extract the S3 key from the image URL
const getKeyFromUrl = (url: string) => {
  const urlParts = url.split('/');
  const key = urlParts.slice(3).join('/');
  return key;
};

// Function to delete the image from S3
export const deleteFromS3 = async (imageUrl: string) => {
  try {
    const key = getKeyFromUrl(imageUrl);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME as string,
      Key: key,
    };

    // Delete the object from S3
    await s3.deleteObject(params).promise();

    console.log(`Successfully deleted ${imageUrl} from S3.`);
    return { success: true, message: `Successfully deleted ${imageUrl}` };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Error deleting file from S3');
  }
};
