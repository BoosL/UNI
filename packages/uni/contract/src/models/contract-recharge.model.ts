import {SelectOption} from '@uni/core';

export interface ContractRecharge {
  id: string;
  type: SelectOption;
  isInstalment: boolean;
  instalmentFee: string;
  downPayment: string;
  instalmentAmount: string;
  serverAmount: string;
  bankAccountsDetail: { [bankAccountId: string]: string };
  useCap: string;
  contractAmount: string;
  totalReceipts: string;
}
