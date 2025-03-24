import { LoanInputDTO, LoanResultDTO } from '../dtos/loan.dto';

export class LoanInputVM {
  loanData: LoanInputDTO;

  constructor(loanData: LoanInputDTO) {
    this.loanData = loanData;
  }
}

export class LoanResultVM {
  result: LoanResultDTO;

  constructor(result: LoanResultDTO) {
    this.result = result;
  }
}
