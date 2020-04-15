import { SelectOption } from '../../models/models';
import { Student } from './student.model';
import { BaseBill } from './bill.model';

export interface StudentBill extends BaseBill {
  paidMoney: string;
  paidTime: string;
  relativeStudent: Student;
  status: SelectOption;
}
