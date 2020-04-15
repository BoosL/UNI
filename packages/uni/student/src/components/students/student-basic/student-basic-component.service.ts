import { Injectable } from '@angular/core';
import { StudentExt } from '../../../models/student-ext.model';
import { NgxExcelComponentService } from 'ngx-excel';

@Injectable()
export class StudentBasicComponentService extends NgxExcelComponentService {

  public autoCommitKeys = [
    'nameCn', 'nameEn', 'gender', 'phone', 'importanceType', 'remark', 'schoolId'
  ] as Array<keyof StudentExt | 'schoolId'>;

}
