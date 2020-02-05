import { LoggerService, LoggerTransport } from 'nest-logger';
import { ConfigService } from './config/config.service';

export const LoggerProvider = {
  provide: LoggerService,
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const mode = process.env.NODE_ENV || 'development';
    const loggers = [];
    loggers.push(LoggerService.console({
      timeFormat: 'HH:mm',
      consoleOptions: {
        level: 'debug',
      },
    }));
    if (mode !== 'development') {
      loggers.push(LoggerService.rotate({
        colorize: false,
        fileOptions: {
          filename: `logs/${config.appName}-%DATE%.error.log`,
          level: 'error',
        },
      }));
      loggers.push(LoggerService.rotate({
        colorize: false,
        fileOptions: {
          filename: `logs/${config.appName}-%DATE%.info.log`,
          level: 'info',
        },
      }));
    }
    return new LoggerService(
      config.logLevel,
      loggers,
    );
  },
};
