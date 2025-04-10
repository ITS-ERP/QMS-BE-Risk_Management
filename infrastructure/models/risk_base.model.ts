import {
  BaseEntity,
  BaseEntityAttributes,
} from '../interfaces/baseEntity.model';

export interface RiskBaseAttributes extends BaseEntityAttributes {
  pkid: number;
  risk_name: string;
  risk_desc: string;
  risk_user: string;
  risk_group: string;
  risk_mitigation: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class RiskBase extends BaseEntity implements RiskBaseAttributes {
    pkid!: number;
    risk_name!: string;
    risk_desc!: string;
    risk_user!: string;
    risk_group!: string;
    risk_mitigation!: string;

    static associate(models: any) {}
  }

  RiskBase.init(
    {
      pkid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      risk_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      risk_desc: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      risk_user: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      risk_group: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      risk_mitigation: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'RiskBase',
      tableName: 'risk_base',
      timestamps: false,
    },
  );

  return RiskBase;
};
