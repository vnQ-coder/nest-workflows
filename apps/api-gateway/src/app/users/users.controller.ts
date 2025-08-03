import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  UserServiceClient,
  USERS_PACKAGE_NAME,
  USER_SERVICE_NAME,
} from '@nest-workflows/shared-types';
import { UserHttpService } from '@nest-workflows/shared-services';

@Controller('users')
export class UsersController implements OnModuleInit {
  private usersService: UserServiceClient;

  constructor(
    @Inject(USERS_PACKAGE_NAME) private client: ClientGrpc,
    private readonly userHttpService: UserHttpService
  ) {}

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
      return await this.userHttpService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to fetch users via REST API',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
