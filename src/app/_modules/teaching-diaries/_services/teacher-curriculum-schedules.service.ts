import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxExcelModelColumnRules, NgxExcelColumnType} from 'ngx-excel';
import {
  BackendService,
  BaseService, ClassroomService, ProductCurriculumService, SchoolService
} from '@uni/core';
import {TeacherCurriculumSchedulesModel} from '../model/teacher-curriculum-schedules.model';
import {EntryStudentService} from '../../curriculum-schedules/_services/entry-student.service';


@Injectable()
export class TeacherCurriculumSchedulesService extends BaseService<TeacherCurriculumSchedulesModel> {

  protected resourceUri = '/teachers/{employee_id}/classes';
  protected resourceName = 'curriculumSchedules';
  protected rules = {
    id: { label: '排课Id', columnType: NgxExcelColumnType.PrimaryKey },
    school: {
      label: '上课校区',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService,
      labelKey: 'name'
    },
    classroom: {
      label: '上课教室',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.classroomService,
      labelKey: 'name',
      prop: 'class_room'
    },
    classroomName: { label: '上课教室', columnType: NgxExcelColumnType.Text },
    courseDate: { label: '上课时间', columnType: NgxExcelColumnType.DateTime },
    courseTime: { label: '上课日期', columnType: NgxExcelColumnType.Date },
    curriculum: {
      label: '上课课程',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.curriculumService,
      labelKey: 'name'
    },
    classStudents: {
      label: '上课学员',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.entryStudentService,
    },
    teachingUpdate: { label: '不可修改日志', columnType: NgxExcelColumnType.Bool, prop: '_teaching_update' },
    teachingInsert: { label: '已添加日志', columnType: NgxExcelColumnType.Bool, prop: '_teaching_insert' },
  } as NgxExcelModelColumnRules<TeacherCurriculumSchedulesModel>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected classroomService: ClassroomService,
    protected curriculumService: ProductCurriculumService,
    protected entryStudentService: EntryStudentService
  ) {
    super(httpClient, backendService);
  }

}
