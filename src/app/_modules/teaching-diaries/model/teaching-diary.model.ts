import {School, SelectOption, Student, UploadFile} from '@uni/core';

export interface TeachingDiaryEntry {
  id: string;
  stType: SelectOption;
  student: Student;
  studentId: string;
  studentName: string;
  taskSituation: SelectOption;
}

export interface TeachingDiaryModel {
  id: string;
  classDescription: string;
  csId: string;
  files: UploadFile[];
  nextTask: string;
  realClassDescription: string;
  task: string;
  taskExt: TeachingDiaryEntry[];
}
