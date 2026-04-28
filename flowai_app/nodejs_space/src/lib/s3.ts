import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createS3Client, getBucketConfig } from './aws-config';

let s3Client: any = null;

function getS3Client() {
  if (!s3Client) {
    s3Client = createS3Client();
  }
  return s3Client;
}

export async function generatePresignedUploadUrl(
  fileName: string,
  contentType: string,
  isPublic = false,
) {
  const client = getS3Client();
  const { bucketName, folderPrefix } = getBucketConfig();

  const cloud_storage_path = isPublic
    ? `${folderPrefix}public/uploads/${Date.now()}-${fileName}`
    : `${folderPrefix}uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: cloud_storage_path,
    ContentType: contentType,
    ContentDisposition: isPublic ? 'attachment' : undefined,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

  return { uploadUrl, cloud_storage_path };
}

export async function initiateMultipartUpload(
  fileName: string,
  isPublic: boolean,
) {
  const client = getS3Client();
  const { bucketName, folderPrefix } = getBucketConfig();

  const cloud_storage_path = isPublic
    ? `${folderPrefix}public/uploads/${Date.now()}-${fileName}`
    : `${folderPrefix}uploads/${Date.now()}-${fileName}`;

  const command = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: cloud_storage_path,
    ContentDisposition: isPublic ? 'attachment' : undefined,
  });

  const response = await client.send(command);
  return { uploadId: response.UploadId, cloud_storage_path };
}

export async function getPresignedUrlForPart(
  cloud_storage_path: string,
  uploadId: string,
  partNumber: number,
) {
  const client = getS3Client();
  const { bucketName } = getBucketConfig();

  const command = new UploadPartCommand({
    Bucket: bucketName,
    Key: cloud_storage_path,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

export async function completeMultipartUpload(
  cloud_storage_path: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[],
) {
  const client = getS3Client();
  const { bucketName } = getBucketConfig();

  const command = new CompleteMultipartUploadCommand({
    Bucket: bucketName,
    Key: cloud_storage_path,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });

  await client.send(command);
}

export async function getFileUrl(
  cloud_storage_path: string,
  isPublic: boolean,
) {
  const client = getS3Client();
  const { bucketName } = getBucketConfig();

  if (isPublic) {
    const region = await client.config.region();
    return `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;
  } else {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: cloud_storage_path,
      ResponseContentDisposition: 'attachment',
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  }
}

export async function deleteFile(cloud_storage_path: string) {
  const client = getS3Client();
  const { bucketName } = getBucketConfig();

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: cloud_storage_path,
  });

  await client.send(command);
}
