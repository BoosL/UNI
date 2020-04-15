import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxExcelModelColumnRules, NgxExcelColumnType} from 'ngx-excel';
import {
  BackendService,
  BaseService, EmployeeService, StudentService
} from '@uni/core';
import {AchievementModel, AchievementSubject} from '../model/achievement.model';
import {Enums} from '../../_enums';

@Injectable()
export class AchievementSubjectService extends BaseService<AchievementSubject> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: { label: '成绩分项主键', columnType: NgxExcelColumnType.PrimaryKey },
    achievementId: { label: '分项名称', columnType: NgxExcelColumnType.Text },
    fraction: { label: '分数', columnType: NgxExcelColumnType.Text },
    name: { label: '分项名称', columnType: NgxExcelColumnType.Text },
    remark: { label: '分项备注', columnType: NgxExcelColumnType.Text, optional: true },
    createdAt: { label: '创建时间', columnType: NgxExcelColumnType.DateTime },
    updatedAt: { label: '修改时间', columnType: NgxExcelColumnType.DateTime }
  } as NgxExcelModelColumnRules<AchievementSubject>;

}

@Injectable()
export class AchievementsService extends BaseService<AchievementModel> {

  protected resourceUri = '/achievements';
  protected resourceName = 'achievements';
  protected rules = {
    id: { label: '成绩Id', columnType: NgxExcelColumnType.PrimaryKey },
    schoolId: { label: '校区Id', columnType: NgxExcelColumnType.Text, prop: 'campus_id' },
    schoolName: { label: '校区', columnType: NgxExcelColumnType.Text, prop: 'campus_name' },
    examDate: { label: '考试日期', columnType: NgxExcelColumnType.Text },
    student: {
      label: '学员',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService,
      labelKey: 'name',
      optional: true
    },
    studentId: { label: '学员Id', columnType: NgxExcelColumnType.Text },
    tutorName: { label: 'tutor姓名', columnType: NgxExcelColumnType.Text, optional: true },
    isProgressed: { label: '是否进步', columnType: NgxExcelColumnType.Bool },
    isQualified: { label: '是否达标', columnType: NgxExcelColumnType.Bool },
    manageId: { label: '', columnType: NgxExcelColumnType.Text },
    remark: { label: '备注', columnType: NgxExcelColumnType.Text, optional: true },
    resultDate: { label: '成绩公布日期', columnType: NgxExcelColumnType.Text },
    staff: {
      label: '学员',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService,
      labelKey: 'name',
      optional: true
    },
    totalScore: { label: '总分数', columnType: NgxExcelColumnType.Text },
    type: {
      label: '考试类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Achievement.Type)
    },
    createdAt: { label: '创建时间', columnType: NgxExcelColumnType.DateTime },
    updatedAt: { label: '修改时间', columnType: NgxExcelColumnType.DateTime },
    subjects: {
      label: '分项',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.achievementSubjectService
    },
  } as NgxExcelModelColumnRules<AchievementModel>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected studentService: StudentService,
    protected employeeService: EmployeeService,
    protected achievementSubjectService: AchievementSubjectService
  ) {
    super(httpClient, backendService);
  }

}
