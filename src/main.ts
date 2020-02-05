import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from 'nest-logger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { ValidationPipe, ValidationError, BadRequestException } from '@nestjs/common';
import { LoggerInterceptor } from './logger.interceptor';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const mode = process.env.NODE_ENV || 'development';
  const options: NestApplicationContextOptions = {};
  if (mode !== 'development') {
    options.logger = false;
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, options);
  // 日志模块
  app.useLogger(app.get(LoggerService));
  // 路由日志拦截器
  app.useGlobalInterceptors(new LoggerInterceptor(app.get(LoggerService)));
  // 接口请求Body校验
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        try {
          return new BadRequestException(Object.values(errors[0].constraints)[0]);
        } catch (error) {
          try {
            return new BadRequestException(Object.values(errors[0].children[0].children[0].constraints)[0]);
          } catch (error) {
            return new BadRequestException('验证失败');
          }
        }
      },
    }),
  );
  // 开启跨域
  app.enableCors();
  if (mode !== 'development') {
    // 安全插件
    app.use(helmet());
    // 压缩请求
    app.use(compression());
    // 跨站点请求伪造
    app.use(csurf());
    // 接口限速
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
      }),
    );
  }
  // 开启swagger
  setupSwagger(app);

  // 监听端口
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
