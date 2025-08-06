import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?:
    | Express.Multer.File[]
    | { [fieldname: string]: Express.Multer.File[] };
}

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  private upload: multer.Multer;

  constructor() {
    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        // Generate unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`);
      },
    });

    const fileFilter = (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      // Allow only image files
      const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ];

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new BadRequestException(
            'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
          )
        );
      }
    };

    this.upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1, // Only one file at a time
      },
    });
  }

  use(req: MulterRequest, res: Response, next: NextFunction) {
    const uploadSingle = this.upload.single('avatar');

    uploadSingle(req, res, (error: any) => {
      if (error) {
        if (error instanceof multer.MulterError) {
          switch (error.code) {
            case 'LIMIT_FILE_SIZE':
              throw new HttpException(
                'File size too large. Maximum size is 5MB.',
                HttpStatus.BAD_REQUEST
              );
            case 'LIMIT_FILE_COUNT':
              throw new HttpException(
                'Too many files. Only one file is allowed.',
                HttpStatus.BAD_REQUEST
              );
            case 'LIMIT_UNEXPECTED_FILE':
              throw new HttpException(
                'Unexpected field name. Use "avatar" as the field name.',
                HttpStatus.BAD_REQUEST
              );
            default:
              throw new HttpException(
                `File upload error: ${error.message}`,
                HttpStatus.BAD_REQUEST
              );
          }
        }
        throw new HttpException(
          error.message || 'File upload failed',
          HttpStatus.BAD_REQUEST
        );
      }

      // File upload is optional - continue even if no file is uploaded
      next();
    });
  }
}
