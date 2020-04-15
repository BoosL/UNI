import { BaseEmployee, SelectOption, CustomerSource, School } from '@uni/core';

export type TmkEmployee = BaseEmployee;

export interface TmkEmployeeConfig extends BaseEmployee {
  relativeSchools: School[];
  level: SelectOption;
  accept: boolean;
  relativeSources: CustomerSource[];
}
