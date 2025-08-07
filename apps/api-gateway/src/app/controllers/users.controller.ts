import {
  Controller,
  Get,
  Post,
  Inject,
  OnModuleInit,
  Body,
  Patch,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateUserDto,
  UpdateUserDto,
  UserServiceClient,
  USERS_PACKAGE_NAME,
  USER_SERVICE_NAME,
} from '@nest-workflows/shared-types';
import { FileInterceptor } from '@nestjs/platform-express';

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
  create(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadFile(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.usersService.updateUser({
      ...body,
      id,
      avatarUrl: file?.path || '',
    });
  }
}
