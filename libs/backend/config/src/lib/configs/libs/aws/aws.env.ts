import {IsNotEmpty, IsOptional, IsString, IsUrl, NotEquals} from 'class-validator';
import { registerAs } from '@nestjs/config';
import { Expose } from 'class-transformer';
import { validateUtil } from '../../../validate.util';

export class _AwsEnv {
  @IsString()
  @IsNotEmpty()
  @Expose()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  AWS_UPLOADER_DATA_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  AWS_SECRET_ACCESS_KEY: string;

  @IsUrl()
  @IsNotEmpty()
  @Expose()
  AWS_CLOUDFRONT_DISTRIBUTION_URL: string;

  // Minio
  @IsOptional()
  @IsString()
  @NotEquals('')
  @Expose()
  MINIO_ACCESS_KEY: string;

  @IsOptional()
  @IsString()
  @NotEquals('')
  @Expose()
  MINIO_SECRET_KEY: string;

  @IsOptional()
  @IsUrl({
    require_tld: false,
    require_host: true,
    require_port: true,
  })
  @NotEquals('')
  @Expose()
  MINIO_ENDPOINT_URL: string;
}

export const AwsEnv = registerAs('aws', () => validateUtil(process.env, _AwsEnv));
