import { DataTypes, Model } from 'sequelize';

export interface BaseEntityAttributes {
  tenant_id?: number;
  created_by?: string;
  created_date?: Date;
  created_host?: string;
  updated_by?: string;
  updated_date?: Date;
  updated_host?: string;
  is_deleted?: boolean;
  deleted_by?: string;
  deleted_date?: Date;
  deleted_host?: string;
}

export class BaseEntity extends Model implements BaseEntityAttributes {
  public tenant_id?: number;
  public created_by?: string;
  public created_date?: Date;
  public created_host?: string;
  public updated_by?: string;
  public updated_date?: Date;
  public updated_host?: string;
  public is_deleted?: boolean;
  public deleted_by?: string;
  public deleted_date?: Date;
  public deleted_host?: string;

  static initBaseAttributes() {
    return {
      tenant_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_host: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      updated_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_host: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      deleted_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted_host: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    };
  }
}
