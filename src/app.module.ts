import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseProvider } from './database.provider';
import { LoggerProvider } from './logger.provider';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RedisModule } from 'nestjs-redis';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from './config/config.service';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';

@Module({
  imports: [
    ConfigModule,
    NestEmitterModule.forRoot(new EventEmitter()),
    RedisModule.forRootAsync({
      useFactory: (config: ConfigService) => config.redis,
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.jwt;
      },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
  ],
  providers: [
    DatabaseProvider,
    LoggerProvider,
    AppService,
    AuthService,
    JwtStrategy,
  ],
})
export class AppModule { }
