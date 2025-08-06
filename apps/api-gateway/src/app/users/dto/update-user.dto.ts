import { IsEmail, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @MinLength(1, { message: 'User ID is required' })
  id: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email?: string;

  // Avatar file path will be set by the controller after file upload
  avatar?: string;
}

export class UpdateUserWithFileDto extends UpdateUserDto {
  file?: Express.Multer.File;
}