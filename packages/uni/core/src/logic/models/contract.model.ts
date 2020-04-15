import { SelectOption } from '../../models/models';
import { Student } from './student.model';
import { Employee } from './employee.model';
import { School } from './school.model';
export interface BaseContract {
  id: string;
  sn: string;
  amount: string;
  actualAmount: string;
  beginTime: string;
  endTime: string;
  givenTime: number;
  createdTime: string;
  type: SelectOption;
  productType: SelectOption;
  status: SelectOption;
}

export interface Contract extends BaseContract {
  levelEtp: SelectOption;
  relativeStudent: Student;
  relativeEmployee: Employee;
  relativeSchool: School;
}
