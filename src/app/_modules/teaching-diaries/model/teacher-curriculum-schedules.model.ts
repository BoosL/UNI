import {Classroom, ProductCurriculum, School} from '@uni/core';
import {EntryStudentModel} from '../../curriculum-schedules/models/entry-student.model';

export interface TeacherCurriculumSchedulesModel {
  id: string;
  school: School;
  classroom: Classroom;
  classroomName: string;
  courseDate: string;
  courseTime: string;
  curriculum: ProductCurriculum;
  classStudents: EntryStudentModel[];
  teachingUpdate: boolean;
  teachingInsert: boolean;
}
