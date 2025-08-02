# User Repository

This document explains how to use the User repository in your NestJS services.

## Setup

### 1. Import the SharedModelsModule

In your service module (e.g., `userService`), import the `SharedModelsModule`:

```typescript
import { Module } from '@nestjs/common';
import { SharedModelsModule } from '@nest-workflows/shared-models';

@Module({
  imports: [
    SharedModelsModule,
    // ... other imports
  ],
  // ... rest of module configuration
})
export class UserServiceModule {}
```

### 2. Inject the UserRepository

In your service, inject the `UserRepository`:

```typescript
import { Injectable } from '@nestjs/common';
import { UserRepository, User } from '@nest-workflows/shared-models';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // Use repository methods here
}
```

## Available Methods

### Basic CRUD Operations

```typescript
// Find all users
const users: User[] = await this.userRepository.findAll();

// Find user by ID
const user: User | null = await this.userRepository.findById(1);

// Create new user
const newUser: User = await this.userRepository.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword'
});

// Update user
const updatedUser: User | null = await this.userRepository.update(1, {
  name: 'Jane Doe'
});

// Delete user
const deleted: boolean = await this.userRepository.delete(1);
```

### Specialized Methods

```typescript
// Find user by email
const user: User | null = await this.userRepository.findByEmail('john@example.com');

// Check if email exists
const exists: boolean = await this.userRepository.existsByEmail('john@example.com');

// Find multiple users by IDs
const users: User[] = await this.userRepository.findByIds([1, 2, 3]);
```

## Example Service Implementation

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository, User } from '@nest-workflows/shared-models';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(userData: Partial<User>): Promise<User> {
    // Check if email already exists
    const emailExists = await this.userRepository.existsByEmail(userData.email!);
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    // Create user
    return this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
  }

  async getUserById(id: number): Promise<User> {
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

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(id, userData);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
```

## Type Safety

The repository is fully typed with TypeScript, providing:
- Type-safe method parameters and return values
- IntelliSense support in your IDE
- Compile-time error checking

## Error Handling

The repository methods return `null` for not found cases. It's recommended to handle these cases in your service layer and throw appropriate HTTP exceptions. 