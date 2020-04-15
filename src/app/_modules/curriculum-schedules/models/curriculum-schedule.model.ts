import {
  Classroom,
  CurriculumPackage,
  Employee,
  Product,
  ProductCurriculum,
  ProductSubject,
  School,
  SelectOption
} from '@uni/core';
import {StudentExt} from '@uni/student';
import {BaseCustomer} from './customer.model';
import {SmallClassModel} from './small-class.model';

export interface RelativeEntity {
  id: string;
  type: SelectOption;
  score: string;
  comment: string;
  student: StudentExt;
  customer: BaseCustomer;
  smallClass?: SmallClassModel;
  relativeSchool: School;
}

export interface BaseCurriculumSchedule {
  id: string;
  time: string;
  classroom: Classroom;
  school: School;
  package: CurriculumPackage;
  status: SelectOption;
  teachingType: SelectOption;
  meetingName: string;
  meetingNumber: string;
  meetingAccount: string;
  score: string;
  remark: string;
  teacher: Employee;
  curriculum: ProductCurriculum;
  creator: Employee;
  createdAt: string;
  productType?: SelectOption;
  subject?: ProductSubject;
  product?: Product;
  relativeEntries: RelativeEntity[];
}

export interface CurriculumScheduleModel extends BaseCurriculumSchedule {
  isComplete: boolean;
}
