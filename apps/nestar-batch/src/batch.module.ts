import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import {ConfigModule} from "@nestjs/config"
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
  controllers: [BatchController],
  providers: [BatchService],
})
export class BatchModule {}
