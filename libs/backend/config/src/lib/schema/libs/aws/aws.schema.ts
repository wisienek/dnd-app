import type { S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Config } from 'nest-zod-config';
import { z } from 'zod';

export const AwsSchema = z
  .object({
    AWS_REGION: z.enum([
      'af-south-1',
      'ap-east-1',
      'ap-northeast-1',
      'ap-northeast-2',
      'ap-northeast-3',
      'ap-south-1',
      'ap-south-2',
      'ap-southeast-1',
      'ap-southeast-2',
      'ap-southeast-3',
      'ap-southeast-4',
      'ca-central-1',
      'cn-north-1',
      'cn-northwest-1',
      'eu-central-1',
      'eu-central-2',
      'eu-north-1',
      'eu-south-1',
      'eu-south-2',
      'eu-west-1',
      'eu-west-2',
      'eu-west-3',
      'me-central-1',
      'me-south-1',
      'sa-east-1',
      'us-east-1',
      'us-east-2',
      'us-gov-east-1',
      'us-gov-west-1',
      'us-west-1',
      'us-west-2',
    ]),
    AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required'),
    AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY is required'),
    AWS_CLOUDFRONT_DISTRIBUTION_URL: z
      .string()
      .url('AWS_CLOUDFRONT_DISTRIBUTION_URL must be a valid URL')
      .min(1, 'AWS_CLOUDFRONT_DISTRIBUTION_URL is required'),
    MINIO_ACCESS_KEY: z
      .string()
      .optional()
      .refine((val) => val !== '', 'MINIO_ACCESS_KEY must not be empty'),
    MINIO_SECRET_KEY: z
      .string()
      .optional()
      .refine((val) => val !== '', 'MINIO_SECRET_KEY must not be empty'),
    MINIO_ENDPOINT_URL: z
      .string()
      .url('MINIO_ENDPOINT_URL must be a valid URL')
      .optional()
      .refine((val) => val !== '', 'MINIO_ENDPOINT_URL must not be empty'),
  })
  .strict();

@Injectable()
export class AwsConfig extends Config(AwsSchema) {
  get s3Options(): Partial<S3ClientConfig> {
    return {
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
      },
      apiVersion: '2010-12-01',
    };
  }

  get devS3Options(): Partial<S3ClientConfig> {
    if (!this.MINIO_ACCESS_KEY || !this.MINIO_SECRET_KEY) {
      throw new Error(`No Minio tokens!`);
    }

    return {
      credentials: {
        accessKeyId: this.MINIO_ACCESS_KEY,
        secretAccessKey: this.MINIO_SECRET_KEY,
      },
      endpoint: this.MINIO_ENDPOINT_URL,
      forcePathStyle: true,
    };
  }
}
