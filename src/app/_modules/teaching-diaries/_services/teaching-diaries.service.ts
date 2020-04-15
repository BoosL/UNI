import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxExcelModelColumnRules, NgxExcelColumnType} from 'ngx-excel';
import {
  BackendService,
  BaseService, SchoolService, StudentService
} from '@uni/core';
import {TeachingDiaryEntry, TeachingDiaryModel} from '../model/teaching-diary.model';
import {Enums} from '../../_enums';
import {Observable, Subject} from 'rxjs';


@Injectable()
export class TeachingDiariesEntryService extends BaseService<TeachingDiaryEntry> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: { label: '#', columnType: NgxExcelColumnType.PrimaryKey },
    stType: {
      label: '实体类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CurriculumSchedule.Relations)
    },
    student: {
      label: '学员',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService,
      labelKey: 'name'
    },
    studentId: { label: '学员Id', columnType: NgxExcelColumnType.Text },
    studentName: { label: '学员名', columnType: NgxExcelColumnType.Text },
    taskSituation: {
      label: '完成情况',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.TeachingDiaries.TaskSituation)
    },
  } as NgxExcelModelColumnRules<TeachingDiaryEntry>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected studentService: StudentService,
  ) {
    super(httpClient, backendService);
  }
}

@Injectable()
export class TeachingDiariesService extends BaseService<TeachingDiaryModel> {

  protected resourceUri = '/curriculum_schedules/{curriculum_schedule_id}/teaching_diaries';
  protected resourceName = '';
  protected rules = {
    id: { label: '成绩Id', columnType: NgxExcelColumnType.PrimaryKey },
    classDescription: { label: '表现情况', columnType: NgxExcelColumnType.Text },
    csId: { label: '排课Id', columnType: NgxExcelColumnType.Text },
    school: {
      label: '上课校区',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService,
      labelKey: 'name'
    },
    files: {
      label: '附件',
      columnType: NgxExcelColumnType.MultiUploadFile,
      acceptedFileType: '.jpg,.jpeg,.png,.bmp', acceptedFileSize: 2000, acceptedFileCount: 5
    },
    nextTask: { label: '下次作业', columnType: NgxExcelColumnType.Text },
    realClassDescription: { label: '真实上课情况', columnType: NgxExcelColumnType.Text },
    task: { label: '本次作业 ', columnType: NgxExcelColumnType.Text },
    taskExt: {
      label: '学员情况',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.teachingDiariesEntryService,
      labelKey: 'name'
    }
  } as NgxExcelModelColumnRules<TeachingDiaryModel>;
  protected taskSituationSubject = new Subject<any>();

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected teachingDiariesEntryService: TeachingDiariesEntryService
  ) {
    super(httpClient, backendService);
  }

  public handleTaskSituationChange(model: TeachingDiaryEntry) {
    this.taskSituationSubject.next(model);
  }

  public getTaskSituationSubject(): Observable<TeachingDiaryEntry> {
    return this.taskSituationSubject as Observable<TeachingDiaryEntry>;
  }

}
