import { SelectOption, UploadFile } from '@uni/core';
import { ContractStudent } from './contract-student.model';
import { ContractEmployee } from './contract-employee.model';
import { ContractDto } from './contract-dto.model';

export interface ContractDeferredRecord {
  id: string;
  type: SelectOption;
  productEndTime: string;
  month: number;
  startTime: string;
  endTime: string;
  fee: string;
  attachments: UploadFile[];
  relativeStudent: ContractStudent;
  relativeEmployee: ContractEmployee;
  relativeContract: ContractDto;
  createdTime: string;
  effectedTime: string;
  status: SelectOption;
  remark: string;
}
