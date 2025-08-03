import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import axios from 'axios';
import {
  UserServiceClient,
  USERS_PACKAGE_NAME,
  USER_SERVICE_NAME,
} from '@nest-workflows/shared-types';

@Controller('users')
export class UsersController implements OnModuleInit {
  private usersService: UserServiceClient;
  
  constructor(@Inject(USERS_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @Get()
  findAll() {
    return this.usersService.listUsers({});
  }

  @Get('/all')
  async restApiFindAll() {
    try {
      // Make HTTP call to userService REST API
      const response = await axios.get('http://localhost:3001/users/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching users via REST API:', error);
      return { error: 'Failed to fetch users via REST API' };
    }
  }

  @Get('/grpc')
  grpcFindAll() {
    return this.usersService.listUsers({});
  }
}
