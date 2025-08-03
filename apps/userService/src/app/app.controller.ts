import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserServiceController,
  UserServiceControllerMethods,
  CreateUserRequest,
  GetUserRequest,
  UpdateUserRequest,
  DeleteUserRequest,
  UserResponse,
  DeleteUserResponse,
  UserListResponse,
  Empty,
} from '@nest-workflows/shared-types';

@Controller('users')
@UserServiceControllerMethods()
export class AppController implements UserServiceController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  // gRPC Methods
  async createUser(request: CreateUserRequest): Promise<UserResponse> {
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
    };
  }

  async updateUser(request: UpdateUserRequest): Promise<UserResponse> {
    const user = await this.appService.updateUser(request.id, {
      fullName: request.fullName,
      email: request.email,
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
    }));

    return { users: userResponses };
  }

  // REST API endpoints (keeping for backward compatibility)
  @Get('all')
  async getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: string) {
    return this.appService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.appService.getUserByEmail(email);
  }

  @Post()
  async createUserRest(@Body() userData: CreateUserDto) {
    return this.appService.createUser(userData);
  }

  @Put(':id')
  async updateUserRest(
    @Param('id', ParseIntPipe) id: string,
    @Body() userData: UpdateUserDto
  ) {
    return this.appService.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUserRest(@Param('id', ParseIntPipe) id: string) {
    await this.appService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
