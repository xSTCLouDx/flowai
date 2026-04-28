"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePresignedUploadUrl = generatePresignedUploadUrl;
exports.initiateMultipartUpload = initiateMultipartUpload;
exports.getPresignedUrlForPart = getPresignedUrlForPart;
exports.completeMultipartUpload = completeMultipartUpload;
exports.getFileUrl = getFileUrl;
exports.deleteFile = deleteFile;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const aws_config_1 = require("./aws-config");
let s3Client = null;
function getS3Client() {
    if (!s3Client) {
        s3Client = (0, aws_config_1.createS3Client)();
    }
    return s3Client;
}
async function generatePresignedUploadUrl(fileName, contentType, isPublic = false) {
    const client = getS3Client();
    const { bucketName, folderPrefix } = (0, aws_config_1.getBucketConfig)();
    const cloud_storage_path = isPublic
        ? `${folderPrefix}public/uploads/${Date.now()}-${fileName}`
        : `${folderPrefix}uploads/${Date.now()}-${fileName}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
        ContentType: contentType,
        ContentDisposition: isPublic ? 'attachment' : undefined,
    });
    const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn: 3600 });
    return { uploadUrl, cloud_storage_path };
}
async function initiateMultipartUpload(fileName, isPublic) {
    const client = getS3Client();
    const { bucketName, folderPrefix } = (0, aws_config_1.getBucketConfig)();
    const cloud_storage_path = isPublic
        ? `${folderPrefix}public/uploads/${Date.now()}-${fileName}`
        : `${folderPrefix}uploads/${Date.now()}-${fileName}`;
    const command = new client_s3_1.CreateMultipartUploadCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
        ContentDisposition: isPublic ? 'attachment' : undefined,
    });
    const response = await client.send(command);
    return { uploadId: response.UploadId, cloud_storage_path };
}
async function getPresignedUrlForPart(cloud_storage_path, uploadId, partNumber) {
    const client = getS3Client();
    const { bucketName } = (0, aws_config_1.getBucketConfig)();
    const command = new client_s3_1.UploadPartCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
        UploadId: uploadId,
        PartNumber: partNumber,
    });
    return await (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn: 3600 });
}
async function completeMultipartUpload(cloud_storage_path, uploadId, parts) {
    const client = getS3Client();
    const { bucketName } = (0, aws_config_1.getBucketConfig)();
    const command = new client_s3_1.CompleteMultipartUploadCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
    });
    await client.send(command);
}
async function getFileUrl(cloud_storage_path, isPublic) {
    const client = getS3Client();
    const { bucketName } = (0, aws_config_1.getBucketConfig)();
    if (isPublic) {
        const region = await client.config.region();
        return `https://${bucketName}.s3.${region}.amazonaws.com/${cloud_storage_path}`;
    }
    else {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: bucketName,
            Key: cloud_storage_path,
            ResponseContentDisposition: 'attachment',
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn: 3600 });
    }
}
async function deleteFile(cloud_storage_path) {
    const client = getS3Client();
    const { bucketName } = (0, aws_config_1.getBucketConfig)();
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: bucketName,
        Key: cloud_storage_path,
    });
    await client.send(command);
}
//# sourceMappingURL=s3.js.map