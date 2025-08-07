import path = require('path');

export const AVATAR_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'avatars');

// Allowed image MIME types
export const allowedImageMimes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);
