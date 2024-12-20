import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucketName = process.env.TODOS_S3_BUCKET
const s3Client = new S3Client()

export async function getPutSignedUrl(key, expiresIn = 300){
  const command = new PutObjectCommand({
    Bucket:  bucketName, 
    Key: key,
  })

  return getSignedUrl(s3Client, command, {
    expiresIn
  })
}

export function getAttachmentUrl(key) {
  return `https://${bucketName}.s3.amazonaws.com/${key}`
}
