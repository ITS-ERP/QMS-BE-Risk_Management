import { BaseEntity } from '../interfaces/baseEntity.model';

export interface BookAttributes {
  pkid: number;
  title: string;
  author: string;
  isbn: string;
  publication_date?: Date;
  available_copies: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Book extends BaseEntity implements BookAttributes {
    pkid!: number;
    title!: string;
    author!: string;
    isbn!: string;
    publication_date?: Date;
    available_copies!: number;
  }

  Book.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      publication_date: {
        type: DataTypes.DATEONLY,
      },
      available_copies: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Book',
      tableName: 'books',
      timestamps: false,
    },
  );

  return Book;
};
