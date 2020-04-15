import {School, Student} from '@uni/core';

export interface SmallClassModel {
  id: string;
  name: string;
  schoolId: string;
  school: School;
  remark: string;
  studentNames: string;
  students: Student[];
  classNumber: string;
  createAt: string;
}
