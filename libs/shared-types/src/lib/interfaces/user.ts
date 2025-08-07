export interface GetUserRequest {
  id: string;
}

export interface DeleteUserRequest {
  userId: string;
}

export interface Empty {}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  permissions: string;
  packageType: string;
  isActive: string;
  packageExpiresAt: string;
  avatarUrl: string;
}

export interface DeleteUserResponse {
  success: boolean;
}

export interface UserListResponse {
  users: UserResponse[];
}
