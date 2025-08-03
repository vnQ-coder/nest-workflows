# API Gateway Endpoints

This document describes the available endpoints in the API Gateway that communicate with the User Service.

## Setup

1. Start the User Service:
   ```bash
   nx serve userService
   ```
   This will start the User Service on port 3001 with both HTTP and gRPC support.

2. Start the API Gateway:
   ```bash
   nx serve api-gateway
   ```
   This will start the API Gateway on port 3000.

## Available Endpoints

### 1. gRPC Endpoint (via API Gateway)
- **URL**: `GET http://localhost:3000/api/users`
- **Description**: Fetches all users using gRPC communication
- **Method**: gRPC call to User Service

### 2. REST API Endpoint (via API Gateway)
- **URL**: `GET http://localhost:3000/api/users/all`
- **Description**: Fetches all users using HTTP REST API call
- **Method**: HTTP GET request to User Service REST API

### 3. Direct gRPC Endpoint (for testing)
- **URL**: `GET http://localhost:3000/api/users/grpc`
- **Description**: Alternative gRPC endpoint for testing
- **Method**: gRPC call to User Service

## Testing the Endpoints

### Using curl:

1. **Test gRPC endpoint**:
   ```bash
   curl http://localhost:3000/api/users
   ```

2. **Test REST API endpoint**:
   ```bash
   curl http://localhost:3000/api/users/all
   ```

3. **Test direct gRPC endpoint**:
   ```bash
   curl http://localhost:3000/api/users/grpc
   ```

### Using a web browser:

Navigate to:
- `http://localhost:3000/api/users` (gRPC)
- `http://localhost:3000/api/users/all` (REST API)
- `http://localhost:3000/api/users/grpc` (gRPC alternative)

## Architecture

- **API Gateway** (Port 3000): Acts as a facade for both gRPC and HTTP calls
- **User Service** (Port 3001): Provides both gRPC and HTTP REST API endpoints
- **Communication**: 
  - gRPC: Direct microservice communication
  - HTTP: REST API calls between services

## Notes

- The User Service now runs as a hybrid application supporting both gRPC and HTTP
- CORS is enabled on the User Service for HTTP API access
- Error handling is implemented for both communication methods
- The API Gateway provides a unified interface for both communication patterns 