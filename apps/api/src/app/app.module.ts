import { RequestContextModule } from 'nestjs-request-context';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module, type Provider } from '@nestjs/common';
import { AutomapperModule } from '@automapper/nestjs';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { classes } from '@automapper/classes';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextInterceptor, ExceptionInterceptor } from '@dnd-app/application';
import { ApiConfig, ProjectConfig, getConfigs } from '@dnd-app/config';
import { DataBaseModule } from '@dnd-app/db';
import { UserModule } from '../idm';

const interceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

const internalModules = [UserModule];

const configs = getConfigs(ProjectConfig, ApiConfig);

@Module({
  imports: [
    DataBaseModule,
    EventEmitterModule.forRoot(),
    RequestContextModule,
    CqrsModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ...configs,
    ...internalModules,
  ],
  providers: [...interceptors],
})
export class AppModule {}
