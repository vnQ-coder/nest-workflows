import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'avatars');

  constructor() {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      this.logger.log('Created upload directory');
    }
  }

  /**
   * Get the relative path for storing in database
   */
  getRelativeFilePath(filename: string): string {
    return `uploads/avatars/${filename}`;
  }

  /**
   * Get the full file path
   */
  getFullFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  /**
   * Delete a file from the filesystem
   */
  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = this.getFullFilePath(filename);
      await fs.unlink(filePath);
      this.logger.log(`Deleted file: ${filename}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file ${filename}:`, error.message);
    }
  }

  /**
   * Check if a file exists
   */
  async fileExists(filename: string): Promise<boolean> {
    try {
      const filePath = this.getFullFilePath(filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file stats
   */
  async getFileStats(filename: string) {
    try {
      const filePath = this.getFullFilePath(filename);
      return await fs.stat(filePath);
    } catch (error) {
      this.logger.warn(`Failed to get file stats for ${filename}:`, error.message);
      return null;
    }
  }
}