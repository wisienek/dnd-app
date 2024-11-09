import { Injectable } from '@nestjs/common';
import { Config } from 'nest-zod-config';
import { z } from 'zod';
import { CloudProvider, NodeEnv } from '@dnd-app/enums';

export const ProjectSchema = z
  .object({
    NODE_ENV: z.nativeEnum(NodeEnv, { description: `Current environment type` }).default(NodeEnv.LOCAL),
    CLOUD_PROVIDER: z.nativeEnum(CloudProvider, { description: `Current cloud provider from the supported list` }),
  })
  .strict();

@Injectable()
export class ProjectConfig extends Config(ProjectSchema) {
  get isLocal(): boolean {
    return this.NODE_ENV === NodeEnv.LOCAL;
  }

  get isProd(): boolean {
    return this.NODE_ENV === NodeEnv.PROD;
  }
}
