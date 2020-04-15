
import {CurriculumScheduleModel, } from './curriculum-schedule.model';
import {Classroom, Employee} from '@uni/core';

export interface ResourceClassroom {
    id: string;
    serial: number;
    classroom: Classroom;
}
export interface ResourceTeacher {
  id: string;
  serial: number;
  teacher: Employee;
}
export interface ResourceSchedule {
  id: string;
  serial: number;
  curriculumSchedule: CurriculumScheduleModel;
}

export interface TeachingResourceModel {
  id: string;
  datetime: string;
  allClassrooms: boolean;
  allTeachers: boolean;
  classrooms: ResourceClassroom[];
  teachers: ResourceTeacher[];
  curriculumSchedules: ResourceSchedule[];
  restName: string;
}
