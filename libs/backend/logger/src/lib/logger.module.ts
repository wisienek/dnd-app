import { Module, Global, Logger } from '@nestjs/common';
import { SimpleLogger } from './loggers';

const pickedLogger = {
  provide: Logger,
  useClass: SimpleLogger,
};

@Global()
@Module({
  providers: [pickedLogger],
  exports: [pickedLogger],
})
export class LoggerModule {}
