import { SelectOption } from '../../models/select-option.model';
import { Area } from './common.model';
import { PriceRuleTemplate, SalaryTemplate } from './price.model';

export interface BaseSchool {
  id: string;
  name: string;
  nameCn: string;
  nameEn: string;
}

export interface School extends BaseSchool {
  alias: string;
  code: string;
  company: string;
  address: string;
  tel: string;
  status: SelectOption;
  relativeArea: Area;
  relativePriceRuleTemplate: PriceRuleTemplate;
  relativeSalaryTemplate: SalaryTemplate;
  relativeOrganizationId: string;
}

export interface SchoolRestTime {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  relativeSchool: School;
  createdTime: string;
}
