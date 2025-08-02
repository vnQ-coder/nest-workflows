# User Service API

This document describes the REST API endpoints for the User Service.

## Base URL
```
http://localhost:3000/users
```

## Endpoints

### 1. Get Service Info
```
GET /
```
Returns basic service information.

**Response:**
```json
{
  "message": "User Service API"
}
```

### 2. Get All Users
```
GET /all
```
Returns all users in the database.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "hashedPassword"
  }
]
```

### 3. Get User by ID
```
GET /:id
```
Returns a specific user by their ID.

**Parameters:**
- `id` (number): User ID

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashedPassword"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

### 4. Get User by Email
```
GET /email/:email
```
Returns a specific user by their email address.

**Parameters:**
- `email` (string): User's email address

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashedPassword"
}
```

### 5. Create User
```
POST /
```
Creates a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required string
- `email`: Required valid email format
- `password`: Required string, minimum 6 characters

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Error Response (409 - Email already exists):**
```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```

### 6. Update User
```
PUT /:id
```
Updates an existing user.

**Parameters:**
- `id` (number): User ID

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Validation Rules:**
- All fields are optional
- `email`: Must be valid email format if provided
- `password`: Minimum 6 characters if provided

**Response:**
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

### 7. Delete User
```
DELETE /:id
```
Deletes a user by ID.

**Parameters:**
- `id` (number): User ID

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `201`: Created (for POST requests)
- `400`: Bad Request (validation errors)
- `404`: Not Found (user not found)
- `409`: Conflict (email already exists)
- `500`: Internal Server Error

## Example Usage

### Using curl:

```bash
# Get all users
curl http://localhost:3000/users/all

# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Get user by ID
curl http://localhost:3000/users/1

# Update user
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe"
  }'

# Delete user
curl -X DELETE http://localhost:3000/users/1
```

## Notes

- The service uses the User repository from the shared-models library
- All database operations are handled through the repository pattern
- Input validation is performed using class-validator
- Error handling follows NestJS best practices 