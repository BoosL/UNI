import { SelectOption, CustomerSource, School } from '@uni/core';

export interface TmkEmployeesSearch {
  id: string;
  keyword: string;
  relativeSchools: School[];
  level: SelectOption;
  acceptCustomer: boolean;
  relativeFirstSource: CustomerSource;
  relativeSecondSource: CustomerSource;
  relativeThirdSource: CustomerSource;
}
