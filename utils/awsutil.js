const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const config = require("./../config");

const s3 = new S3Client({
  region: config.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload file to S3
async function uploadFile(file) {
  const imageName = Date.now() + file.originalname;
  const params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: imageName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    return imageName;
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
}

// Generate signed URL for image
async function generateSignedUrl(filename, expiresIn = 60) {
  const params = {
    // Bucket: awsBucketName,
    // Bucket: config.AWS_BUCKET_NAME,
    Bucket: "free-stream-hub",
    Key: filename,
  };

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn });
    return url;
  } catch (err) {
    console.error("URL generation error:", err);
    return "";
  }
}

// Delete file from S3
async function deleteFile(bucketName, key) {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    const response = await S3Client.send(command);
    return response;
  } catch (err) {
    console.error("Delete error:", err);
  }
}

module.exports = { uploadFile, generateSignedUrl, deleteFile };
