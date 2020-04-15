import {
  Employee, SelectOption
} from '@uni/core';
import {MarketingCustomer} from '../models/marketing-customer.model';
import {CustomerFollowRecord} from '../models/customer-follow-record.model';
import {CustomerVisitedRecord} from '../models/customer-visited-record.model';
import { CustomerConsultingRecordModel as CustomerConsultingRecord} from '../models/customer-consulting-record.model';
import { CustomerEmployeeTransferredRecord } from './customer-employee-transferred-record.model';
import { CustomerSchoolTransferredRecord } from './customer-school-transferred-record.model';
import { CustomerReservedRecord } from './customer-reserved-record.model';
import { CustomerCompatibleFollowRecord } from './customer-compatible-follow-record.model';

export interface CustomerTimeline {
  id: string;
  type: SelectOption;
  relativeEmployee: Employee;
  note: string;
  createdTime: string;
  relativeCustomer: MarketingCustomer;
  tmkFollowRecord: CustomerCompatibleFollowRecord;
  tmkReservedRecord: CustomerReservedRecord;
  tmkTransferredRecord: CustomerEmployeeTransferredRecord;
  ccFollowRecord: CustomerFollowRecord;
  ccReservedRecord: CustomerReservedRecord;
  ccConsultingRecord: CustomerConsultingRecord;
  ccTransferredRecord: CustomerEmployeeTransferredRecord;
  usVisitedRecord: CustomerVisitedRecord;
  scTransferredRecord: CustomerEmployeeTransferredRecord;
  schoolTransferredRecord: CustomerSchoolTransferredRecord;
}
