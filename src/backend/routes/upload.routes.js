// src/backend/routes/upload.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Memory upload with 30MB limit
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 },
});

const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper to save a buffer locally
async function saveBufferLocally(buffer, originalName = 'upload.png') {
  const ext = path.extname(originalName) || '.png';
  const baseName = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 30);
  const filename = `${baseName || 'image'}-${Date.now()}${ext}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  await fs.promises.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

// Helper to try uploading to Cloudinary
async function tryCloudinaryUpload(buffer) {
  if (!hasCloudinary) return null;
  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'growzybytes', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result?.secure_url || null);
        }
      );
      uploadStream.end(buffer);
    });
  } catch (err) {
    console.warn('Cloudinary upload error:', err.message);
    return null;
  }
}

// POST /api/upload
router.post('/', (req, res) => {
  // Check if content-type is json or if body already contains base64/image
  if (req.is('application/json') || (req.body && (req.body.image || req.body.base64 || req.body.data))) {
    handleBase64Upload(req, res);
    return;
  }

  // Handle multipart form upload with error fallback
  memoryUpload.any()(req, res, async (err) => {
    if (err) {
      console.warn('Multer parse warning:', err.message);
      // If client sent json or base64 inside body
      if (req.body && (req.body.image || req.body.base64 || req.body.data)) {
        return handleBase64Upload(req, res);
      }
      return res.status(400).json({ message: err.message || 'File upload error' });
    }

    try {
      const file = req.files && req.files.length > 0 ? req.files[0] : req.file;

      if (!file) {
        // Check if image data is in body
        if (req.body && (req.body.image || req.body.base64 || req.body.data)) {
          return handleBase64Upload(req, res);
        }
        return res.status(400).json({ message: 'No image file uploaded' });
      }

      // Try Cloudinary first
      const cloudUrl = await tryCloudinaryUpload(file.buffer);
      if (cloudUrl) {
        return res.status(200).json({
          success: true,
          imageUrl: cloudUrl,
          image: cloudUrl,
          url: cloudUrl,
        });
      }

      // Save locally to /uploads
      const localUrl = await saveBufferLocally(file.buffer, file.originalname);
      return res.status(200).json({
        success: true,
        imageUrl: localUrl,
        image: localUrl,
        url: localUrl,
      });
    } catch (uploadError) {
      console.error('File saving error:', uploadError);
      return res.status(500).json({ message: 'Failed to process image upload' });
    }
  });
});

// JSON Base64 Handler
async function handleBase64Upload(req, res) {
  try {
    const rawData = req.body.image || req.body.base64 || req.body.data;
    if (!rawData || typeof rawData !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing base64 image data' });
    }

    // If it's already an HTTP / HTTPS or relative URL
    if (rawData.startsWith('http://') || rawData.startsWith('https://') || rawData.startsWith('/uploads/')) {
      return res.status(200).json({
        success: true,
        imageUrl: rawData,
        image: rawData,
        url: rawData,
      });
    }

    // Parse Data URI: data:image/png;base64,iVBORw...
    let matches = rawData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let mimeType = 'image/png';
    let base64String = rawData;

    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64String = matches[2];
    }

    const buffer = Buffer.from(base64String, 'base64');
    let ext = '.png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('gif')) ext = '.gif';
    else if (mimeType.includes('svg')) ext = '.svg';

    const cloudUrl = await tryCloudinaryUpload(buffer);
    if (cloudUrl) {
      return res.status(200).json({
        success: true,
        imageUrl: cloudUrl,
        image: cloudUrl,
        url: cloudUrl,
      });
    }

    const localUrl = await saveBufferLocally(buffer, `upload${ext}`);
    return res.status(200).json({
      success: true,
      imageUrl: localUrl,
      image: localUrl,
      url: localUrl,
    });
  } catch (err) {
    console.error('Base64 upload error:', err);
    return res.status(500).json({ message: 'Failed to process base64 image' });
  }
}

export default router;
