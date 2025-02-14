import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region: 'blr1', // Update this to match your DigitalOcean region
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

export const generateUploadUrl = async (file: Buffer, originalFilename: string): Promise<string> =>{
  const extension = originalFilename.split('.').pop();
  const filename = `${uuidv4()}.${extension}`;
  const key = `profile-images/${filename}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: key,
      Body: file,
      ACL: "public-read",
      ContentType: `image/${extension}`
    })
  );

  return `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_ENDPOINT}/${key}`;
}