import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  UserServiceController,
  UserServiceControllerMethods,
  GetUserRequest,
  DeleteUserRequest,
  UserResponse,
  DeleteUserResponse,
  UserListResponse,
  Empty,
  CreateUserDto,
  UpdateUserDto,
} from '@nest-workflows/shared-types';

@Controller('users')
@UserServiceControllerMethods()
export class AppController implements UserServiceController {
  constructor(private readonly appService: AppService) {}

  // gRPC Methods
  async createUser(request: CreateUserDto): Promise<UserResponse> {
    const user = await this.appService.createUser({
      fullName: request.fullName,
      email: request.email,
      password: request.password,
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role || 'user',
      permissions: Array.isArray(user.permissions)
        ? user.permissions.join(',')
        : user.permissions || '',
      packageType: user.packageType || 'free',
      isActive: user.isActive ? 'true' : 'false',
      packageExpiresAt: user.packageExpiresAt
        ? user.packageExpiresAt.toISOString()
        : '',
      avatarUrl: user.avatarUrl || '',
    };
  }

  async getUser(request: GetUserRequest): Promise<UserResponse> {
    const user = await this.appService.getUserById(request.id);

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role || 'user',
      permissions: Array.isArray(user.permissions)
        ? user.permissions.join(',')
        : user.permissions || '',
      packageType: user.packageType || 'free',
      isActive: user.isActive ? 'true' : 'false',
      packageExpiresAt: user.packageExpiresAt
        ? user.packageExpiresAt.toISOString()
        : '',
      avatarUrl: user.avatarUrl || '',
    };
  }

  async updateUser(request: UpdateUserDto): Promise<UserResponse> {
    const user = await this.appService.updateUser(request.id, request);

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role || 'user',
      permissions: Array.isArray(user.permissions)
        ? user.permissions.join(',')
        : user.permissions || '',
      packageType: user.packageType || 'free',
      isActive: user.isActive ? 'true' : 'false',
      packageExpiresAt: user.packageExpiresAt
        ? user.packageExpiresAt.toISOString()
        : '',
      avatarUrl: user?.avatarUrl || '',
    };
  }

  async deleteUser(request: DeleteUserRequest): Promise<DeleteUserResponse> {
    await this.appService.deleteUser(request.userId);
    return { success: true };
  }

  async listUsers(request: Empty): Promise<UserListResponse> {
    const users = await this.appService.getAllUsers();

    const userResponses: UserResponse[] = users.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role || 'user',
      permissions: Array.isArray(user.permissions)
        ? user.permissions.join(',')
        : user.permissions || '',
      packageType: user.packageType || 'free',
      isActive: user.isActive ? 'true' : 'false',
      packageExpiresAt: user.packageExpiresAt
        ? user.packageExpiresAt.toISOString()
        : '',
      avatarUrl: user.avatarUrl || '',
    }));

    return { users: userResponses };
  }
}
