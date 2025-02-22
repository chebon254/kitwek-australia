import { S3 } from '@aws-sdk/client-s3';

export const s3Client = new S3({
  endpoint: `https://${process.env.SPACES_ENDPOINT}`,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  }
});

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  
  await s3Client.putObject({
    Bucket: process.env.SPACES_BUCKET!,
    Key: fileName,
    Body: file,
    ACL: 'public-read',
  });

  return `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_ENDPOINT}/${fileName}`;
};
