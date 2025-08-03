import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Create the main HTTP application
  const app = await NestFactory.create(AppModule);

  // Enable CORS for HTTP API
  app.enableCors();

  // Create gRPC microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'users',
      protoPath: join(
        process.cwd(),
        'libs/shared-types/src/lib/proto/users.proto'
      ),
    },
  });

  // Start both HTTP and gRPC services
  await app.startAllMicroservices();
  await app.listen(3001);

  console.log('User Service is running on port 3001 (HTTP + gRPC)');
}

bootstrap();
