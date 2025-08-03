import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  /**
   * Get user service URL from environment variables
   */
  get userServiceUrl(): string {
    return process.env.USER_SERVICE_URL || 'http://localhost:3001';
  }

  /**
   * Get auth service URL from environment variables
   */
  get authServiceUrl(): string {
    return process.env.AUTH_SERVICE_URL || 'http://localhost:3002';
  }

  /**
   * Get HTTP timeout configuration
   */
  get httpTimeout(): number {
    return parseInt(process.env.HTTP_TIMEOUT || '5000', 10);
  }

  /**
   * Get retry attempts for HTTP requests
   */
  get retryAttempts(): number {
    return parseInt(process.env.HTTP_RETRY_ATTEMPTS || '3', 10);
  }

  /**
   * Get retry delay for HTTP requests
   */
  get retryDelay(): number {
    return parseInt(process.env.HTTP_RETRY_DELAY || '1000', 10);
  }

  /**
   * Check if we're in development mode
   */
  get isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Check if we're in production mode
   */
  get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
} 