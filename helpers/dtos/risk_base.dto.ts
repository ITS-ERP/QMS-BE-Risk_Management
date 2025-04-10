import { RiskBaseAttributes } from '../../infrastructure/models/risk_base.model';

export interface RiskBaseInputDTO {
  pkid: number;
  risk_name: string;
  risk_desc: string;
  risk_user: string;
  risk_group: string;
  risk_mitigation: string;
}

export interface RiskData {
  total_quantity: number;
  total_good: number;
  total_defect: number;
  good_rate: number;
  defect_rate: number;
}

export interface RiskBaseResultDTO extends RiskBaseAttributes {}
