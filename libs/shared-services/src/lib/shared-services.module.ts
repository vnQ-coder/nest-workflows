import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CustomHttpService } from './http.service';
import { UserHttpService } from './user-http.service';
import { ConfigService } from './config.service';

@Module({
  imports: [HttpModule],
  providers: [CustomHttpService, UserHttpService, ConfigService],
  exports: [CustomHttpService, UserHttpService, ConfigService],
})
export class SharedServicesModule {}
