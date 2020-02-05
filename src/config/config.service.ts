import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as path from 'path';
import { SequelizeOptions } from 'sequelize-typescript';
import { JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class ConfigService {
  env: { [key: string]: string };

  constructor() {
    const mode = process.env.NODE_ENV || 'development';
    this.load(path.resolve(process.cwd(), `.env.${mode}`));
    this.load(path.resolve(process.cwd(), '.env'));
  }

  load(envPath: string = '') {
    const env = dotenv.config({
      path: envPath,
    });
    dotenvExpand(env);
    // this.logger.info(`加载配置:${envPath}`, 'ConfigService');
    this.env = env.parsed;
  }

  get appName(): string {
    return this.env.APP_NAME;
  }

  get logLevel(): string {
    return this.env.LOG_LEVEL;
  }

  get sequelize(): SequelizeOptions {
    const env = process.env.NODE_ENV || 'development';
    return {
      dialect: 'mysql',
      host: this.env.MYSQL_HOST,
      port: parseInt(this.env.MYSQL_PORT, 10),
      username: this.env.MYSQL_USER,
      password: this.env.MYSQL_PASSWORD,
      database: this.env.MYSQL_DATABASE,
      timezone: '+08:00',
      // logging: str => env === 'development' ? this.logger.debug(str, 'SEQUELIZE') : null,
    };
  }

  get redis() {
    return {
      host: this.env.REDIS_HOST,
      port: parseInt(this.env.REDIS_PORT, 10),
      db: parseInt(this.env.REDIS_DB, 10),
      password: this.env.REDIS_PASSWORD,
      keyPrefix: this.env.REDIS_PRIFIX,
    };
  }

  get jwt(): JwtModuleOptions {
    return {
      secret: this.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600 * 24 * parseInt(this.env.JWT_EXPIRES_DAY, 10),
      },
    };
  }
}
