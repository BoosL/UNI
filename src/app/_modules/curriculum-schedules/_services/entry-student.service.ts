import {BaseService, BackendService, StudentService, SchoolService} from '@uni/core';
import {StudentExtService} from '@uni/student';
import {NgxExcelColumnType} from 'ngx-excel';
import {EntryStudentModel} from '../models/entry-student.model';
import {Enums} from '../../_enums';
import {HttpClient} from '@angular/common/http';
import {CurriculumScheduleModel, RelativeEntity} from '../models/curriculum-schedule.model';
import {Observable, Subject, throwError, of, forkJoin} from 'rxjs';
import {SignClassService} from './sign-class.service';
import {map, mergeMap} from 'rxjs/operators';
import * as lodash from 'lodash';
import {NzMessageService} from 'ng-zorro-antd';
import {CurriculumScheduleService} from './curriculum-schedule.service';
import {Injectable} from '@angular/core';
@Injectable({providedIn: 'root'})
export class EntryStudentService extends BaseService<EntryStudentModel> {
  protected resourceUri = '/curriculum_schedules/{schedule_id}/students';
  protected resourceName = 'classStudents';
  protected rules = {
    id: { label: '#', columnType: NgxExcelColumnType.PrimaryKey },
    csId: { label: '排课Id', columnType: NgxExcelColumnType.Text },
    mark: {
      label: '状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.CurriculumScheduleStudentStatus)
    },
    stType: {
      label: '实体类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.Relations), prop: 'st_type'
    },
    signClass: {
      label: '签课状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.SignClassType), prop: 'sign_class'
    },
    student: {
      label: '课程学员',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService,
      labelKey: 'name',
      typeaheadKey: 'keyword'
    },
    studentId: { label: '学员Id', columnType: NgxExcelColumnType.Text, prop: 'student_id' },
    studentName: { label: '学员姓名', columnType: NgxExcelColumnType.Text, prop: 'student_name' },
    save: { label: '学员姓名', columnType: NgxExcelColumnType.Bool, prop: '_save' },
    attachments: {
      label: '附件上传', columnType: NgxExcelColumnType.UploadFile,
      acceptedFileType: '.jpg,.jpeg,.png,.bmp', acceptedFileSize: 2000, acceptedFileCount: 5,
      prop: 'files'
    }
  };
  // tslint:disable: variable-name
  private _entryStudents: EntryStudentModel[];
  private _componentValue: CurriculumScheduleModel;
  private _oldEntryStudents: EntryStudentModel[];
  private _availableEntryStudentsSubject = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected studentService: StudentExtService,
    protected schoolService: SchoolService,
    protected signClassService: SignClassService,
    protected message: NzMessageService,
    protected curriculumScheduleService: CurriculumScheduleService
  ) {
    super(httpClient, backendService);
  }


  public getAvailableEntryStudentsSubject(): Observable<EntryStudentModel[]> {
    return this._availableEntryStudentsSubject as Observable<EntryStudentModel[]>;
  }

  public setComponentValue(res: CurriculumScheduleModel) {
    this._componentValue = res;
    this._getEntryStudentsList();
  }

  private _getEntryStudentsList(filters?: { [name: string]: string | string[] }, page?: number, pageSize?: number) {
    this.getList({ scheduleId: this._componentValue.id }, page, pageSize).subscribe((result) => {
      this._oldEntryStudents = lodash.cloneDeep(result);
      this._entryStudents = result;
      this._availableEntryStudentsSubject.next(this._entryStudents);
    });
  }
  public setEntryStudent(entryStudent: EntryStudentModel) {
    if (this._entryStudents && this._entryStudents.length > 0) {
      const entry = this._entryStudents.find( (item) => item.id === entryStudent.id);
      this._entryStudents.splice(this._entryStudents.indexOf(entry), 1, entryStudent);
      this._availableEntryStudentsSubject.next(this._entryStudents);
    }
  }

  public handleSignClassChanged(entryStudent: EntryStudentModel) {
      return this.save({
        scheduleId: this._componentValue.id,
        product_type: this._componentValue.productType.value,
        sign_class: entryStudent.signClass.value
      }, entryStudent.id);
  }

  public saveChange(attachment: any) {
    const param = {
      scheduleId: this._componentValue.id,
      attachmentUrl: attachment.url ? attachment.url : '',
      productType: this._componentValue.productType.value,
      class_students: []
    };
    const requestList = [];
    for (const item of this._entryStudents) {
      if (item.signClass && parseFloat(item.signClass.value) <= 0) {
        return throwError(new Error('存在未签课学员'));
      }
      for (const oldItem of this._oldEntryStudents) {
        if (item.id === oldItem.id && item.signClass.value !== oldItem.signClass.value) {
          if ( parseFloat(oldItem.signClass.value) <= 0 ) {
            param.class_students.push({
              id: item.id,
              sign_class: item.signClass.value
            });
          } else {
            requestList.push(this.handleSignClassChanged(item));
          }
          break;
        }
      }
    }
    if (param.class_students && param.class_students.length > 0) {
      requestList.push(this.signClassService.save(param));
    }
    return forkJoin(requestList).pipe(
      map( () => {
        this._getEntryStudentsList();
      }),
      mergeMap(() => {
        return this.curriculumScheduleService.getModel(this._componentValue.id, { schoolId: this._componentValue.school.id });
      })
    );
   /* return this.signClassService.save(param).pipe(
      mergeMap(() => {
        return this.curriculumScheduleService.getModel(this._componentValue.id, { schoolId: this._componentValue.school.id });
      })
    );*/
  }
  public confirmBtnIsAble(): boolean {
    let bool = false;
    for (const item of this._oldEntryStudents) {
      if (!item.signClass || item.signClass.value === '0') {
        bool = true;
      }
    }
    return bool;
  }
}
