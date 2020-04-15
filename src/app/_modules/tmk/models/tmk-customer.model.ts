import {MarketingCustomer} from '@uni/customer';
import {SelectOption} from '@uni/core';

export interface TmkCustomer extends MarketingCustomer {
  check: string;
  identity: string;
  endCode: SelectOption;
  tmkStatus: SelectOption;
  isDuplicate: string;
  lastFollowedAt: string;
  allotAt: string;
  nextTime: string;
  protectedRemainTime: string;
  isPublic: boolean;
}
