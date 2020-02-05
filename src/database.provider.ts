import { ConfigService } from './config/config.service';
import { Sequelize } from 'sequelize-typescript';
import { UserModel } from './models/user.model';

export const DatabaseProvider = {
  provide: 'SEQUELIZE',
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const sequelize = new Sequelize(config.sequelize);
    sequelize.addModels([
      UserModel,
    ]);
    await sequelize.sync({
      alter: true,
    });
    return sequelize;
  },
};
