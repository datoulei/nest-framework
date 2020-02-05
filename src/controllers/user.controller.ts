import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { ApiTags, ApiOperation, ApiOkResponse, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('/users')
export class UserController {

  @ApiOperation({ summary: '用户列表' })
  @Get()
  async findAll(): Promise<UserModel[]> {
    return UserModel.findAll();
  }

  @ApiOperation({ summary: '用户列表总数' })
  @Get('/count')
  async count(): Promise<number> {
    return UserModel.count();
  }

  @ApiOperation({ summary: '创建用户' })
  @Post()
  async create(
    @Body() body: CreateUserDto,
  ): Promise<UserModel> {
    return UserModel.create(body);
  }
}
