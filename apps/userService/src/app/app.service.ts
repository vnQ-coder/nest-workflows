import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository, User } from '@nest-workflows/shared-models';

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UserRepository) {}

  async getData(): Promise<{ message: string }> {
    return { message: 'User Service API' };
  }

  // User management methods
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    // Check if email already exists
    const emailExists = await this.userRepository.existsByEmail(
      userData.email!
    );
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // In a real application, you would hash the password here
    // For now, we'll use the password as-is (not recommended for production)
    return this.userRepository.create(userData);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(id, userData);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }
}
