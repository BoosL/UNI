import { SelectOption, CustomerSource, Employee } from '@uni/core';
import { CustomersSearch } from '@uni/customer';
import { School } from '@uni/core';
import {TmkEmployee} from './tmk-employee.model';

export interface TmkCustomersSearch extends CustomersSearch {
  callCode: SelectOption;
  lastFollowRange: string;
  tmkTimeRange: string;
  nextTimeRange: string;
  tmkStatus: SelectOption;
  isDuplicate: boolean;
  school: School;
  tmk: TmkEmployee;
}
