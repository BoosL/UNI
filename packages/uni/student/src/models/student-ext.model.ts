import { BaseStudent, UploadFile, SelectOption, School, Employee } from '@uni/core';

export interface StudentEtpSeries extends SelectOption {
  percent: number;
  isStart: boolean;
  isEnd: boolean;
  isCurrent: boolean;
  status: 'invailable-lower' | 'available' | 'inavailable-higher';
}

export interface StudentExt extends BaseStudent {
  portrait: UploadFile;
  gender: SelectOption;
  phone: string;
  school: School;
  importanceType: SelectOption;
  levelEtpStart: SelectOption;
  levelEtpEnd: SelectOption;
  levelEtpCurrent: SelectOption;
  levelEtpPercent: number;
  levelEtpSeries: Array<StudentEtpSeries>;
  sc: Employee;
  cc: Employee;
  tutor: Employee;
  scFollow: SelectOption;
  curriculumBeginTime: string;
  curriculumEndTime: string;
  curriculumCount: number;
  customerId: number;
  firstContractedAt: string;
  status: SelectOption;
  remark: string;
}
