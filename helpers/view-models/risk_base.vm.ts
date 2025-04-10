import { RiskBaseInputDTO, RiskBaseResultDTO } from '../dtos/risk_base.dto';

export class RiskBaseInputVM {
  RiskBaseData: RiskBaseInputDTO;

  constructor(RiskBaseData: RiskBaseInputDTO) {
    this.RiskBaseData = RiskBaseData;
  }
}

export class RiskBaseResultVM {
  result: RiskBaseResultDTO;

  constructor(result: RiskBaseResultDTO) {
    this.result = result;
  }
}
