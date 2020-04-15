import {
  SelectOption,
  Employee
} from '@uni/core';
import {MarketingCustomer} from './marketing-customer.model';

export interface TodayVisitedRecord {
  id: string;
  cc: Employee;
  relativeMarketingCustomer: MarketingCustomer;
  nextVisitedTime: string;
  visitedTime: string;
  leaveTime: string;
  consultingDuration: number;
  consultingStatus: SelectOption;
}
