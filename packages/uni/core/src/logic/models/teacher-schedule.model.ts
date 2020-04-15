import { Employee } from './employee.model';
import { School } from './school.model';
import { SelectOption } from '../../models/models';

export interface TeacherSchedule {
  id: string;
  relativeTeachers: Employee[];
  relativeSchool: School;
  type: SelectOption;
  frequency: SelectOption;
  week: SelectOption;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  createdTime: string;
  remark: string;
}
