import {SelectOption, Student, ProductSubject} from '@uni/core';
import {ContractDto} from '@uni/contract';

export interface StudentContractLog {
  id: string;
  type: SelectOption;
  studentId: string;
  contractId: string;
  contract: ContractDto;
  schoolId: string;
  amount: string;
  actualReceivedAmount?: string;
  refundableAmount?: string;
  actualRefundAmount?: string;
  excessAmount?: string;
  oldSchool?: Student;
  newSchool?: Student;
  oldSubjects?: ProductSubject[];
  newSubjects?: ProductSubject[];
  productType?: SelectOption;
  status: SelectOption;
  createdAt: string;
  updatedAt: string;
}
