import { BaseStudent, Employee } from '@uni/core';

export interface ContractStudent extends BaseStudent {
  sc: Employee;
  cc: Employee;
}
