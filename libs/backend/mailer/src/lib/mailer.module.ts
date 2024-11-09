import { Module } from '@nestjs/common/decorators';
import { type DynamicModule } from '@nestjs/common';
import { ProjectConfig } from '@dnd-app/config';
import { CloudProvider } from '@dnd-app/enums';

@Module({})
export class MailerModule {
  public static register(): DynamicModule {
    const cloudConfig = new ProjectConfig();

    switch (cloudConfig.CLOUD_PROVIDER) {
      case CloudProvider.AWS:
        return MailerModule.AWSSESModule(cloudConfig.isLocal);
      case CloudProvider.GCP:
      case CloudProvider.AZURE:
        return this.SMTPModule(cloudConfig.isLocal);
    }
  }

  private static AWSSESModule(isLocal: boolean): DynamicModule {
    return {
      module: MailerModule,
      imports: [],
      providers: [],
      exports: [],
    };
  }

  private static SMTPModule(isLocal: boolean): DynamicModule {
    return {
      module: MailerModule,
      imports: [],
      providers: [],
      exports: [],
    };
  }
}
