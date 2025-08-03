import { Injectable, Logger } from '@nestjs/common';
import { CustomHttpService } from './http.service';
import { ConfigService } from './config.service';

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

@Injectable()
export class UserHttpService {
  private readonly logger = new Logger(UserHttpService.name);

  constructor(
    private readonly httpService: CustomHttpService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    try {
      this.logger.debug('Fetching all users from user service');
      return await this.httpService.get<User[]>(`${this.configService.userServiceUrl}/users/all`);
    } catch (error) {
      this.logger.error('Failed to fetch all users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async findById(id: number): Promise<User> {
    try {
      this.logger.debug(`Fetching user with ID: ${id}`);
      return await this.httpService.get<User>(`${this.configService.userServiceUrl}/users/${id}`);
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async create(userData: CreateUserDto): Promise<User> {
    try {
      this.logger.debug('Creating new user:', userData);
      return await this.httpService.post<User>(`${this.configService.userServiceUrl}/users`, userData);
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async update(id: number, userData: UpdateUserDto): Promise<User> {
    try {
      this.logger.debug(`Updating user with ID ${id}:`, userData);
      return await this.httpService.put<User>(`${this.configService.userServiceUrl}/users/${id}`, userData);
    } catch (error) {
      this.logger.error(`Failed to update user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async delete(id: number): Promise<void> {
    try {
      this.logger.debug(`Deleting user with ID: ${id}`);
      await this.httpService.delete(`${this.configService.userServiceUrl}/users/${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Health check for user service
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      this.logger.debug('Checking user service health');
      return await this.httpService.get<{ status: string; timestamp: string }>(
        `${this.configService.userServiceUrl}/health`
      );
    } catch (error) {
      this.logger.error('User service health check failed:', error);
      throw error;
    }
  }
} 