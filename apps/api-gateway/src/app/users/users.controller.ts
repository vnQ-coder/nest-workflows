import {
  Controller,
  Get,
  Post,
  Inject,
  OnModuleInit,
  Body,
  Patch,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  UserServiceClient,
  USERS_PACKAGE_NAME,
  USER_SERVICE_NAME,
} from '@nest-workflows/shared-types';
import { UpdateUserDto } from '@nest-workflows/shared-services';

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

  @Post()
  create(@Body() body: { fullName: string; email: string; password: string }) {
    return this.usersService.createUser(body);
  }

  @Patch()
  update(@Body() body: UpdateUserDto) {
    return this.usersService.updateUser(body);
  }
}
