import { SelectOption, CustomerSource, Employee } from '@uni/core';

export interface CustomersSearch {
  name: string;
  phone: string;
  createdTimeRange: string;
  status: SelectOption;
  isEffective: boolean;
  isImportant: boolean;
  contactType: SelectOption;
  hasDeposit: boolean;
  relativeFirstSource: CustomerSource;
  relativeSecondSource: CustomerSource;
  relativeThirdSource: CustomerSource;
  level: SelectOption;
  capacity: SelectOption;
  grade: SelectOption;
  ageRange: SelectOption;
  learningPurpose: SelectOption;
  relativeSourceEmployee: Employee;
  lastVisitedTimeRange: string;
  nextVisitedTimeRange: string;
  cc: Employee;
  subordinate: boolean;
  contractRate: number;
  visitType: SelectOption;
}
