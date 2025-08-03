import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users/users.controller';
import { USERS_PACKAGE_NAME } from '@nest-workflows/shared-types';
import { SharedServicesModule } from '@nest-workflows/shared-services';

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
    SharedServicesModule,
  ],
  controllers: [UsersController],
})
export class AppModule {}
