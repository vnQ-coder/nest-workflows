import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users/users.controller';
import { USERS_PACKAGE_NAME } from '@nest-workflows/shared-types';

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
  ],
  controllers: [UsersController],
})
export class AppModule {}
