import { RequestContextModule } from 'nestjs-request-context';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Module, type Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ContextInterceptor, ExceptionInterceptor } from '@dnd-app/application';
import { ConfigModuleInternal, ServerConfig } from '@dnd-app/config';
import { DataBaseModule, getConfig } from '@dnd-app/db';
import { UserModule } from '../idm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbType } from '@dnd-app/core';

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

@Module({
  imports: [
    DataBaseModule,
    EventEmitterModule.forRoot(),
    RequestContextModule,
    CqrsModule,
    ConfigModuleInternal.forConfigs(ServerConfig),
    ...internalModules,
  ],
  providers: [...interceptors],
})
export class AppModule {}
