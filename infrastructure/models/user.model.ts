import { BaseEntity } from '../interfaces/baseEntity.model';
import { RoleUser } from '../../helpers/enum/roleUser.enum';

export interface UserAttributes {
  pkid: number;
  username: string;
  full_name: string;
  email: string;
  role: RoleUser;
  password: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends BaseEntity implements UserAttributes {
    pkid!: number;
    username!: string;
    full_name!: string;
    email!: string;
    role!: RoleUser;
    password!: string;
  }

  User.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: Object.values(RoleUser),
        allowNull: false,
        defaultValue: RoleUser.Borrower,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false,
    },
  );

  return User;
};
