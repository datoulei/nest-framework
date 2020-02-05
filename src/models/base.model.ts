import { Model, Table, Column, DataType, BeforeFindAfterOptions, Comment } from 'sequelize-typescript';

@Table({
  timestamps: true,
  underscored: true,
  version: true,
  paranoid: true,
})
export abstract class BaseModel<T> extends Model<BaseModel<T>> {
  @Comment('创建者')
  @Column(DataType.INTEGER)
  createdBy: number;

  /**
   * 默认排序条件
   * @param options
   */
  @BeforeFindAfterOptions
  static beforeFind(options: any) {
    if (!options.order) {
      options.order = [['createdAt', 'DESC']];
    }
  }
}
