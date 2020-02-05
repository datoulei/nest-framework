import { Injectable } from '@nestjs/common';
import * as IORedis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserModel } from '../models/user.model';

@Injectable()
export class AuthService {
  private client: IORedis.Redis;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.client = this.redisService.getClient();
  }

  async signIn(payload: JwtPayload): Promise<string> {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async validateUser(payload: JwtPayload): Promise<UserModel> {
    return UserModel.findByPk(payload.id);
  }

  decode(token: string): any {
    return this.jwtService.decode(token);
  }

}
