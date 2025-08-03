# Shared Services Library

This library provides reusable HTTP services and utilities for the NestJS microservices architecture.

## Features

- **CustomHttpService**: A wrapper around `@nestjs/axios` with enhanced error handling and logging
- **UserHttpService**: A specialized service for communicating with the User Service REST API
- **ConfigService**: Centralized configuration management for service URLs and HTTP settings

## Installation

The library is automatically available when you import `SharedServicesModule` in your application.

## Usage

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { SharedServicesModule } from '@nest-workflows/shared-services';

@Module({
  imports: [SharedServicesModule],
  // ... other module configuration
})
export class AppModule {}
```

### 2. Use CustomHttpService

```typescript
import { Injectable } from '@nestjs/common';
import { CustomHttpService } from '@nest-workflows/shared-services';

@Injectable()
export class MyService {
  constructor(private readonly httpService: CustomHttpService) {}

  async fetchData() {
    try {
      const data = await this.httpService.get('https://api.example.com/data');
      return data;
    } catch (error) {
      // Error is already handled and formatted by CustomHttpService
      throw error;
    }
  }
}
```

### 3. Use UserHttpService

```typescript
import { Injectable } from '@nestjs/common';
import { UserHttpService } from '@nest-workflows/shared-services';

@Injectable()
export class MyController {
  constructor(private readonly userHttpService: UserHttpService) {}

  async getAllUsers() {
    return await this.userHttpService.findAll();
  }

  async getUserById(id: number) {
    return await this.userHttpService.findById(id);
  }

  async createUser(userData: { name: string; email: string }) {
    return await this.userHttpService.create(userData);
  }
}
```

### 4. Use ConfigService

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nest-workflows/shared-services';

@Injectable()
export class MyService {
  constructor(private readonly configService: ConfigService) {}

  getServiceUrl() {
    return this.configService.userServiceUrl;
  }

  getTimeout() {
    return this.configService.httpTimeout;
  }
}
```

## Configuration

### Environment Variables

The following environment variables can be configured:

- `USER_SERVICE_URL`: URL of the User Service (default: `http://localhost:3001`)
- `AUTH_SERVICE_URL`: URL of the Auth Service (default: `http://localhost:3002`)
- `HTTP_TIMEOUT`: HTTP request timeout in milliseconds (default: `5000`)
- `HTTP_RETRY_ATTEMPTS`: Number of retry attempts for failed requests (default: `3`)
- `HTTP_RETRY_DELAY`: Delay between retry attempts in milliseconds (default: `1000`)
- `NODE_ENV`: Environment mode (`development`, `production`)

### Example .env file

```env
USER_SERVICE_URL=http://localhost:3001
AUTH_SERVICE_URL=http://localhost:3002
HTTP_TIMEOUT=10000
HTTP_RETRY_ATTEMPTS=5
HTTP_RETRY_DELAY=2000
NODE_ENV=development
```

## Error Handling

All HTTP services include comprehensive error handling:

- **Network errors**: Handled with appropriate error messages
- **HTTP status errors**: Formatted with status codes and response data
- **Request setup errors**: Captured and reported
- **Logging**: All requests and errors are logged for debugging

## Available Methods

### CustomHttpService

- `get<T>(url: string, config?: AxiosRequestConfig): Promise<T>`
- `post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>`
- `put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>`
- `delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>`
- `patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>`

### UserHttpService

- `findAll(): Promise<User[]>`
- `findById(id: number): Promise<User>`
- `create(userData: CreateUserDto): Promise<User>`
- `update(id: number, userData: UpdateUserDto): Promise<User>`
- `delete(id: number): Promise<void>`
- `healthCheck(): Promise<{ status: string; timestamp: string }>`

### ConfigService

- `userServiceUrl: string`
- `authServiceUrl: string`
- `httpTimeout: number`
- `retryAttempts: number`
- `retryDelay: number`
- `isDevelopment: boolean`
- `isProduction: boolean`

## Best Practices

1. **Always use the shared services** instead of direct axios calls
2. **Configure environment variables** for different environments
3. **Handle errors appropriately** in your controllers/services
4. **Use TypeScript interfaces** for type safety
5. **Monitor logs** for debugging and performance analysis

## Migration from Direct Axios Usage

If you're migrating from direct axios usage:

**Before:**
```typescript
import axios from 'axios';

async function fetchUsers() {
  const response = await axios.get('http://localhost:3001/users/all');
  return response.data;
}
```

**After:**
```typescript
import { UserHttpService } from '@nest-workflows/shared-services';

constructor(private readonly userHttpService: UserHttpService) {}

async fetchUsers() {
  return await this.userHttpService.findAll();
}
```

This approach provides better error handling, logging, configuration management, and maintainability.
