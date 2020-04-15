import { Injectable } from '@angular/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { BaseStudent, Student } from '../models/student.model';

export abstract class BaseStudentService<T extends BaseStudent> extends BaseService<T> {

  protected rules = {
    id: {
      label: '学员主键',
      columnType: NgxExcelColumnType.PrimaryKey,
    },
    sn: {
      label: '学员编号', columnType: NgxExcelColumnType.Text,
      prop: 'student_number'
    },
    nameCn: {
      label: '中文名称', columnType: NgxExcelColumnType.Text,
      prop: 'name'
    },
    nameEn: {
      label: '英文名称', columnType: NgxExcelColumnType.Text,
      prop: 'enname'
    },
    name: {
      label: '学员姓名', columnType: NgxExcelColumnType.Text,
      resolveValue: (_: any, model: Partial<T>) => this.resolveName(model),
      optional: true
    }
  } as NgxExcelModelColumnRules<T>;

  protected resolveName(model: Partial<T>) {
    if (model.nameCn && model.nameEn) {
      return `${model.nameCn} (${model.nameEn})`;
    }
    return model.nameCn || model.nameEn || '';
  }

}

@Injectable()
export class StudentService extends BaseStudentService<Student> {
  protected resourceUri = 'campuses/{school_id}/students';
  protected resourceName = 'students';
}
