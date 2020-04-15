import { School, Customer } from '@uni/core';

export interface CustomerReservedRecord {
  id: string;
  school: School;
  nextVisitedTime: string;
  relativeCustomer: Customer;
}
