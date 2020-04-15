import { UploadFile, SelectOption, School } from '@uni/core';
import { TmkCustomer } from './tmk-customer.model';
import {TmkCustomerActionCode} from './tmk-customer-action-code.model';

export interface TmkCustomerFollowRecord {
  id: string;
  content: string;
  school: School;
  nextFollowTime: string;
  nextVisitedTime: string;
  tmkStatus: SelectOption;
  actionCode: TmkCustomerActionCode;
  isEnableNextTime: boolean;
  isEnableReservationTime: boolean;
  relativeMarketingCustomer: TmkCustomer;
}
