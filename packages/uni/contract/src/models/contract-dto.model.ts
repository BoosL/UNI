import { Product, ProductSubject, Contract} from '@uni/core';
import {MarketingCustomer} from '@uni/customer';

export interface Instalment {
  instalmentBank: string;
  instalmentNum: string;
  instalmentRate: string;
  instalmentFee: string;
  instalmentBankName: string;
  instalmentAmount: string;
}

export interface ContractDto extends Contract {
  previewUrl?: string;
  relativeProducts?: Product[];
  relativeSubjects?: ProductSubject[];
  productEndTime?: string;
  instalment?: Instalment;
  isInstalment?: boolean;
  downPayment?: string;
  customer?: MarketingCustomer;
  isDeposit?: boolean;
  unpaidAmount?: string;
  serverAmount?: string;
}
