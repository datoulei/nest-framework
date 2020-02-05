import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 } from 'uuid';
import { LoggerService } from 'nest-logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {

  constructor(
    private readonly logger: LoggerService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const uuid = v4();
    this.logger.setContext(context.getClass().name);
    this.logger.setRequestId(uuid);
    this.logger.info(`=============进入路由:${context.getClass().name}-${context.getHandler().name}=============`);
    const now = Date.now();
    return next.handle().pipe(
      tap(() => this.logger.info(`===========离开路由:${context.getClass().name}-${context.getHandler().name};耗时: ${Date.now() - now}ms=========`)),
    );
  }
}
