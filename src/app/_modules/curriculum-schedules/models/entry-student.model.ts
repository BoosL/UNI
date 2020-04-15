import {SelectOption, Student} from '@uni/core';
import {StudentExt} from '@uni/student';
import {UploadFile} from 'ng-zorro-antd';

export interface EntryStudentModel {
  id: string;
  csId: string;
  mark: SelectOption;
  stType: SelectOption;
  signClass: SelectOption;
  student: StudentExt;
  studentId: string;
  studentName: string;
  save: boolean;
  attachments: UploadFile;
}

export interface EntrySigningStudentModel {
  attachmentUrl: string;
  productType: string;
}
