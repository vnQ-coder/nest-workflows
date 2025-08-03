import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpServiceConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

@Injectable()
export class CustomHttpService {
  private readonly logger = new Logger(CustomHttpService.name);
  private readonly httpService: HttpService;

  constructor(private readonly http: HttpService) {}

  /**
   * Make a GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      this.logger.debug(`Making GET request to: ${url}`);
      const response: AxiosResponse<T> = await firstValueFrom(
        this.http.get<T>(url, config)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`GET request failed for ${url}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Make a POST request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      this.logger.debug(`Making POST request to: ${url}`);
      const response: AxiosResponse<T> = await firstValueFrom(
        this.http.post<T>(url, data, config)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`POST request failed for ${url}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      this.logger.debug(`Making PUT request to: ${url}`);
      const response: AxiosResponse<T> = await firstValueFrom(
        this.http.put<T>(url, data, config)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`PUT request failed for ${url}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      this.logger.debug(`Making DELETE request to: ${url}`);
      const response: AxiosResponse<T> = await firstValueFrom(
        this.http.delete<T>(url, config)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`DELETE request failed for ${url}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      this.logger.debug(`Making PATCH request to: ${url}`);
      const response: AxiosResponse<T> = await firstValueFrom(
        this.http.patch<T>(url, data, config)
      );
      return response.data;
    } catch (error) {
      this.logger.error(`PATCH request failed for ${url}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle and format errors consistently
   */
  private handleError(error: any): Error {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
      const customError = new Error(errorMessage);
      (customError as any).status = error.response.status;
      (customError as any).response = error.response.data;
      return customError;
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error(`Request setup error: ${error.message}`);
    }
  }
} 