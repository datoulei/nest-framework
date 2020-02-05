import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { LoginResponseDto } from '../dto/login-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { WhereOptions } from 'sequelize/types';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('/login')
  async login(
    @Body() body: LoginDto,
  ): Promise<LoginResponseDto> {
    const where: WhereOptions = {
      mobile: body.username,
    };
    const user = await UserModel.scope('password').findOne({ where });
    if (!user) {
      throw new BadRequestException('手机号或密码错误');
    }
    if (!user.validPassowrd(body.password)) {
      throw new BadRequestException('手机号或密码错误');
    }
    const token = await this.authService.signIn({ id: user.id });
    return {
      token,
    };
  }
}
