import { SelectOption } from '../../models/models';
import { Bank, BankInstalment } from './common.model';

export interface BaseBill {
  id: string;
  contractType: SelectOption;
  productType: SelectOption;
  amount: string;
  isInstalment: boolean;
  bank: Bank;
  instalment: BankInstalment;
  receivableMoney: string;
  deadline: string;
}

export type Bill = BaseBill;
