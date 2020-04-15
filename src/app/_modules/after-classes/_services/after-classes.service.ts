import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxExcelModelColumnRules, NgxExcelColumnType} from 'ngx-excel';
import {
  BackendService,
  BaseService, EmployeeService
} from '@uni/core';
import {StudentExtService} from '@uni/student';
import {Enums} from '../../_enums';
import {AcTask, AfterClassModel} from '../model/after-class.model';

@Injectable()
export class ActTaskService extends BaseService<AcTask> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: { label: '任务主键', columnType: NgxExcelColumnType.PrimaryKey },
    student: {
      label: '学员',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService,
      labelKey: 'name',
      optional: true
    },
    studentId: { label: '学员Id', columnType: NgxExcelColumnType.Text },
    taskDate: { label: '任务日期', columnType: NgxExcelColumnType.DateTime },
    timeSchool: { label: '到校时间', columnType: NgxExcelColumnType.Time },
  } as NgxExcelModelColumnRules<AcTask>;
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected studentService: StudentExtService,
  ) {
    super(httpClient, backendService);
  }

}

@Injectable()
export class AfterClassesService extends BaseService<AfterClassModel> {

  protected resourceUri = '/after_classes';
  protected resourceName = 'acTasks';
  protected rules = {
    id: { label: '成绩Id', columnType: NgxExcelColumnType.PrimaryKey },
    actId: { label: '任务Id', columnType: NgxExcelColumnType.Text },
    acTask: {
      label: '学员',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.actTaskService,
      labelKey: 'name',
      optional: true
    },
    status: {
      label: '完成情况',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.AfterClass.TaskStatus),
    },
    correctionOpinion: { label: '批改情况', columnType: NgxExcelColumnType.Text, optional: true },
    task: { label: '任务内容', columnType: NgxExcelColumnType.Text },
    time: { label: '分项名称', columnType: NgxExcelColumnType.Time },
    createdAt: { label: '创建时间', columnType: NgxExcelColumnType.DateTime },
    updatedAt: { label: '修改时间', columnType: NgxExcelColumnType.DateTime }
  } as NgxExcelModelColumnRules<AfterClassModel>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected actTaskService: ActTaskService,
    protected employeeService: EmployeeService,
  ) {
    super(httpClient, backendService);
  }

}
