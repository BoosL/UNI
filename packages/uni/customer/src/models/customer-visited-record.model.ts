import { SelectOption, School, Employee } from '@uni/core';
import { MarketingCustomer } from './marketing-customer.model';

export interface CustomerVisitedRecord {
  id: string;
  school: School;
  visitedTime: string;
  visitorCount: number;
  leaveTime: string;
  consultingDuration: number;
  consultingStatus: SelectOption;
  cc: Employee;
  relativeMarketingCustomer: MarketingCustomer;
  remark: string;
  visitType: SelectOption;
}
