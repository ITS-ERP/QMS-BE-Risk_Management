import { LoanAttributes } from '../../infrastructure/models/loan.model';
import { StatusLoan } from '../enum/statusLoan.enum';

export interface LoanInputDTO {
  user_id: number;
  book_id: number;
  loan_date: Date;
  return_date?: Date;
  due_date: Date;
  status: StatusLoan;
}

export interface LoanResultDTO extends LoanAttributes {}
