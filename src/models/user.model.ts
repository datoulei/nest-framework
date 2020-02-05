import { createHash } from 'crypto';
import { Table, Column, Comment, DataType, Default, BeforeCreate, BeforeUpdate, DefaultScope, Scopes, Index } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { ApiProperty } from '@nestjs/swagger';

export enum UserType {
  admin = 1,
  manager = 2,
  patch = 3,
  shop = 4,
}

export type User = typeof UserModel;

@DefaultScope({
  attributes: {
    exclude: ['password', 'salt'],
  },
})
@Scopes({
  password: {
    attributes: {
      include: ['password', 'salt'],
    },
  },
})
@Table({
  tableName: 'users',
})
export class UserModel extends BaseModel<UserModel> {

  @Index('name')
  @Comment('用户名')
  @Column
  username: string;

  @Comment('密码')
  @Column
  password: string;

  @Comment('加盐')
  @Column
  salt: string;

  @Index('mobile')
  @Comment('手机号')
  @Column
  mobile: string;

  @Comment('用户类型 0-普通用户 1-管理员')
  @Default(0)
  @Column(DataType.INTEGER)
  type: UserType;

  @Default(false)
  @Comment('是否禁用')
  @Column
  isDisabled: boolean;

  @BeforeCreate
  @BeforeUpdate
  static updatePassword(instance: UserModel) {
    if (instance.changed('password')) {
      const md5 = createHash('md5');
      instance.salt = Math.random()
        .toString()
        .slice(2, 8);
      instance.password = md5.update(`${instance.password}:${instance.salt}`).digest('hex');
    }
  }

  validPassowrd(password: string): boolean {
    const md5 = createHash('md5');
    const checkPassword = md5.update(`${password}:${this.salt}`).digest('hex');
    return checkPassword === this.password;
  }

}
