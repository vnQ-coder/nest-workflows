import {
  Module,
  MiddlewareConsumer,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users/users.controller';
import { USERS_PACKAGE_NAME } from '@nest-workflows/shared-types';
import { SharedServicesModule } from '@nest-workflows/shared-services';
import { FileService } from './services/file.service';
import { FileUploadMiddleware } from './middleware/file-upload.middleware';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// Define the directory where avatars will be uploaded
const AVATAR_UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'avatars');

// Ensure the upload directory exists
if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
  fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
}

// Allowed image MIME types
const allowedImageMimes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
]);

@Module({
  imports: [
    // gRPC client registration for the Users microservice
    ClientsModule.register([
      {
        name: USERS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: 'libs/shared-types/src/lib/proto/users.proto',
        },
      },
    ]),

    // Multer configuration for avatar image upload
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, AVATAR_UPLOAD_DIR);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname).toLowerCase();
          const uniqueName = `avatar-${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}${ext}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (allowedImageMimes.has(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1,
      },
    }),

    SharedServicesModule,
  ],
  controllers: [UsersController],
  providers: [FileService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply file upload middleware only to PATCH /users/:id
    consumer
      .apply(FileUploadMiddleware)
      .forRoutes({ path: 'users/:id', method: RequestMethod.PATCH });
  }
}
