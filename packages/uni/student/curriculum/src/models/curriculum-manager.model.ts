import { StudentBoughtProduct, StudentBoughtSubject, SelectOption, Employee } from '@uni/core';

export interface CurriculumManagementNode {
  id: string;
  level: number;
  name: string;
  type: SelectOption;
  startTime: string;
  endTime: string;
  remainedCurriculumCount: number;
  consumedCurriculumCount: number;
  lockedCurriculumCount: number;
  overdueCurriculumCount: number;
  deprecatedCurriculumCount: number;
  curriculumCount: number;
  relativeProduct: StudentBoughtProduct;
  relativeSubject: StudentBoughtSubject;
  relativeTeacher: Employee;
  canBindTeacher: boolean;
}
