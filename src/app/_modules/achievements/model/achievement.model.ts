import {Employee, SelectOption, Student} from '@uni/core';

export interface AchievementSubject {
  id: string;
  achievementId: string;
  fraction: string;
  name: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}
export interface AchievementModel {
  id: string;
  schoolId: string;
  schoolName: string;
  examDate: string;
  student: Student;
  studentId: string;
  tutorName: string;
  isProgressed: boolean;
  isQualified: boolean;
  manageId: string;
  remark: string;
  resultDate: string;
  staff: Employee;
  totalScore: string;
  type: SelectOption;
  createdAt: string;
  updatedAt: string;
  subjects: AchievementSubject[];
}
