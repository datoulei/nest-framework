import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { LoggerService } from 'nest-logger';

@Controller()
export class AppController {
  constructor(
    private readonly logger: LoggerService,
    private readonly appService: AppService,
  ) { }

  @Get()
  getHello(): string {
    this.logger.debug('test');
    return this.appService.getHello();
  }
}
