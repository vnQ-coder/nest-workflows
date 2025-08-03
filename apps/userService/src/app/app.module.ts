import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, SharedModelsModule } from '@nest-workflows/shared-models';
import { SharedTypesModule } from '@nest-workflows/shared-types';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'macbook',
      password: '',
      database: 'workflows_db',
      entities: [User],
      synchronize: false,
    }),
    SharedModelsModule,
    SharedTypesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
