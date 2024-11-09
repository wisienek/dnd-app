import { Module } from '@nestjs/common';
import { AwsConfig, getConfigs, ProjectConfig } from '@dnd-app/config';
import { S3Service } from './s3.service';

@Module({
  imports: [...getConfigs(AwsConfig, ProjectConfig)],
  providers: [S3Service],
  exports: [S3Service],
})
export class AwsModule {}
