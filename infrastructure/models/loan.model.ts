import { BaseEntity } from '../interfaces/baseEntity.model';
import { StatusLoan } from '../../helpers/enum/statusLoan.enum';

export interface LoanAttributes {
  pkid: number;
  user_id: number;
  book_id: number;
  loan_date: Date;
  return_date?: Date;
  due_date: Date;
  status: StatusLoan;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Loan extends BaseEntity implements LoanAttributes {
    pkid!: number;
    user_id!: number;
    book_id!: number;
    loan_date!: Date;
    return_date?: Date;
    due_date!: Date;
    status!: StatusLoan;

    static associate(models: any) {
      // Define associations here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
      this.belongsTo(models.Book, {
        foreignKey: 'book_id',
      });
    }
  }

  Loan.init(
    {
      pkid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      loan_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      return_date: {
        type: DataTypes.DATEONLY,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(StatusLoan),
        allowNull: false,
        defaultValue: StatusLoan.Borrowed,
      },
      ...BaseEntity.initBaseAttributes(),
    },
    {
      sequelize,
      modelName: 'Loan',
      tableName: 'loans',
      timestamps: false,
    },
  );

  return Loan;
};
