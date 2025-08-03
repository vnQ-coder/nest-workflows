# gRPC Setup Documentation

## Overview

This project now includes gRPC microservice communication with the following setup:

### 1. Generated TypeScript Types

The gRPC types are generated from `proto/users.proto` and exported from the `@nest-workflows/shared-types` library:

```typescript
import {
  UserServiceClient,
  UserServiceController,
  CreateUserRequest,
  GetUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  UserResponse,
  DeleteUserResponse,
  UserListResponse,
  Empty
} from '@nest-workflows/shared-types';
```

### 2. User Service Implementation

The `userService` now implements the gRPC interface with the following methods:

- `createUser(request: CreateUserRequest): Promise<UserResponse>`
- `getUser(request: GetUserRequest): Promise<UserResponse>`
- `updateUser(request: UpdateUserRequest): Promise<UserResponse>`
- `deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse>`
- `listUsers(request: Empty): Promise<UserListResponse>`

### 3. How to Use the gRPC Client

#### In another service (e.g., API Gateway):

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserServiceClient } from '@nest-workflows/shared-types';

@Injectable()
export class UserClientService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    return firstValueFrom(this.userService.createUser(userData));
  }

  async getUser(id: string): Promise<UserResponse> {
    return firstValueFrom(this.userService.getUser({ id }));
  }

  async updateUser(id: string, userData: Partial<UpdateUserRequest>): Promise<UserResponse> {
    return firstValueFrom(this.userService.updateUser({ id, ...userData }));
  }

  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    return firstValueFrom(this.userService.deleteUser({ userId }));
  }

  async listUsers(): Promise<UserListResponse> {
    return firstValueFrom(this.userService.listUsers({}));
  }
}
```

#### Module Configuration:

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserClientService } from './user-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: 'libs/shared-types/src/lib/proto/users.proto',
        },
      },
    ]),
  ],
  providers: [UserClientService],
  exports: [UserClientService],
})
export class UserClientModule {}
```

### 4. Running the Services

#### Start the User Service (gRPC microservice):
```bash
nx serve userService
```

#### Start the API Gateway (with gRPC client):
```bash
nx serve api-gateway
```

### 5. Type Safety

All gRPC communication is fully type-safe with TypeScript interfaces generated from the protobuf definitions. The types are automatically exported from the shared-types library and can be imported in any service that needs to communicate with the User Service.

### 6. Benefits

- **Type Safety**: Full TypeScript support with generated interfaces
- **Performance**: gRPC is more efficient than REST for microservice communication
- **Code Generation**: Automatic code generation from protobuf definitions
- **Consistency**: Shared types across all services
- **Scalability**: Better suited for microservice architectures

### 7. File Structure

```
libs/shared-types/
├── src/
│   ├── lib/
│   │   ├── proto/
│   │   │   └── users.proto          # Protobuf definition
│   │   └── types/
│   │       └── proto/
│   │           └── users.ts         # Generated TypeScript types
│   └── index.ts                     # Exports all types

apps/userService/
├── src/
│   ├── app/
│   │   ├── app.controller.ts        # Implements gRPC interface
│   │   ├── app.service.ts           # Business logic
│   │   └── app.module.ts            # gRPC microservice config
│   └── main.ts                      # gRPC microservice bootstrap
```

The setup is now complete and ready for use! The User Service exposes both gRPC endpoints (for microservice communication) and REST endpoints (for backward compatibility). 