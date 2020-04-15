import { SelectOption, Product, ProductSubject, ProductCurriculum, BaseContract, Bank, BankInstalment } from '@uni/core';

export type CartType = 'new-purchase'
  | 'continuous-purchase'
  | 'swap'
  | 'etp-exchange'
  | 'non-etp-exchange'
  | 'etp-translation';

export interface CartEntityTimeSectionConfig {
  startTime?: string;
  endTime?: string;
}

export interface CartRequestParam extends CartEntityTimeSectionConfig {
  action: 'buy' | 'refund' | 'time';
  product?: Product;
  subject?: ProductSubject;
  curriculums?: ProductCurriculum[];
  buyMode?: SelectOption;
  productType?: SelectOption;
  isRefund?: boolean;
  curriculumCount?: number;
  levelCount?: number;
  levelStart?: SelectOption;
  levelEnd?: SelectOption;
  purpose?: SelectOption;
}

export interface CartEntity extends ProductSubject {
  buyMode: SelectOption;
  isRefund?: boolean;
}

export interface CartDiscount {
  id: string;
  name: string;
  allowProductTypes: SelectOption[];
  productType: SelectOption;
  mode: string;
  options: SelectOption[];
  value: string;
  default: string;
}

// tslint:disable-next-line: no-empty-interface
export interface CartContract extends BaseContract { }

export interface CartBill {
  id: string;
  amount: string;
  instalmentMode: SelectOption;
  bank: Bank;
  instalment: BankInstalment;
  instalmentFee: string;
  receivableMoney: string;
}
