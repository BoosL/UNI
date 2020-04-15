import {BackendService, BaseService, SchoolService, StudentService} from '@uni/core';
import {NgxExcelColumnType} from 'ngx-excel';
import {HttpClient} from '@angular/common/http';
import {SmallClassModel} from '../models/small-class.model';
import {Injectable} from '@angular/core';
@Injectable({providedIn: 'root'})
export class SmallClassService extends BaseService<SmallClassModel> {
  protected resourceUri = 'small_classes';
  protected resourceName = 'small_classes';
  protected rules = {
    id: { label: '小班主键', columnType: NgxExcelColumnType.PrimaryKey },
    name: {
      label: '小班名称',
      columnType: NgxExcelColumnType.Text
    },
    classNumber: { label: '小班人数', columnType: NgxExcelColumnType.Text },
    schoolId: { label: '校区id', columnType: NgxExcelColumnType.Text },
    school: {
      label: '所属校区',
      columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService,
      labelKey: 'name'
    },
    studentNames: { label: '学生姓名', columnType: NgxExcelColumnType.Text, prop: 'student_names' },
    students: {
      label: '小班学员',
      columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.studentService,
      labelKey: 'name'
    },
    remark: { label: '备注', columnType: NgxExcelColumnType.Text },
    createAt: { label: '创建日期', columnType: NgxExcelColumnType.DateTime, prop: 'create_at' },
  }

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected studentService: StudentService
  ) {
    super(httpClient, backendService);
  }
}
