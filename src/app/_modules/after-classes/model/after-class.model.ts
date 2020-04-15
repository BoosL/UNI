import {SelectOption} from '@uni/core';
import {StudentExt} from '@uni/student';

export interface AcTask {
  id: string;
  student: StudentExt;
  studentId: string;
  taskDate: string;
  timeSchool: string;
}

export interface AfterClassModel {
  id: string;
  actId: string;
  acTask: AcTask;
  correctionOpinion: string;
  status: SelectOption;
  task: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}
