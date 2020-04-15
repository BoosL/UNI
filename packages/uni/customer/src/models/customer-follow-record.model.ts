import { UploadFile, SelectOption } from '@uni/core';
import { MarketingCustomer } from './marketing-customer.model';

export interface CustomerFollowRecord {
  id: string;
  type: SelectOption;
  duration: SelectOption;
  isInvite: boolean;
  inviteFailedReason: string;
  nextVisitedTime: string;
  nextFollowBeginTime: string;
  nextFollowEndTime: string;
  contractRate: SelectOption;
  attachments: UploadFile[];
  remark: string;
  reasonForAbandoning: string;
  relativeMarketingCustomer: MarketingCustomer;
}
