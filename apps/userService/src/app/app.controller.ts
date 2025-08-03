import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  // User endpoints
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
  async createUser(@Body() userData: CreateUserDto) {
    return this.appService.createUser(userData);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Body() userData: UpdateUserDto
  ) {
    return this.appService.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: string) {
    await this.appService.deleteUser(id);
    return { message: 'User deleted successfully' };
  }
}
