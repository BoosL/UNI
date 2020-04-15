import {Employee} from '@uni/core';

export interface TmkCustomersMigrate {
  action: string;
  fromTmk: Employee;
  targetTmk: Employee;
  customers: string[];
  allCustomers: boolean;
  count: string;
  migrateCount: string;
}
