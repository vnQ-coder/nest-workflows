import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import {
  allowedImageMimes,
  AVATAR_UPLOAD_DIR,
  USERS_PACKAGE_NAME,
} from '@nest-workflows/shared-types';
import { SharedServicesModule } from '@nest-workflows/shared-services';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
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
    MulterModule.register({
      storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
          if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
            fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
          }
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
        fileSize: 5 * 1024 * 1024,
        files: 1,
      },
    }),
    SharedServicesModule,
  ],
  controllers: [UsersController],
})
export class AppModule {}
