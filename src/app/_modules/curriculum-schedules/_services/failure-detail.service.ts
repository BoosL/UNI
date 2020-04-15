import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxExcelColumnType, NgxExcelService} from 'ngx-excel';
import {FailureDetail} from '../models/failure-detail';
import { Student, StudentService, BackendService, BaseService,
  ProductCurriculum, ProductService, ProductSubjectService,
  ProductCurriculumService, Product, ProductSubject} from '@uni/core';

@Injectable({providedIn: 'root'})
export class FailureDetailService extends BaseService<FailureDetail> {
  protected resourceUri = 'campuses/{school_id}/courses_fail_logs';
  protected resourceName = 'courses_fail_logs';
  protected rules = {
    id: { label: '键值', columnType: NgxExcelColumnType.PrimaryKey },
    coursesNumber: { label: '排课号', columnType: NgxExcelColumnType.Text, optional: true },
    type: { label: '类型', columnType: NgxExcelColumnType.Text, optional: true },
    time: { label: '排课时间', columnType: NgxExcelColumnType.Text, prop: 'class_date', optional: true },
    reason: { label: '失败原因', columnType: NgxExcelColumnType.Text, optional: true },
    createdAt: { label: '创建时间', columnType: NgxExcelColumnType.DateTime, optional: true },
    updatedAt: { label: '更改时间', columnType: NgxExcelColumnType.DateTime, optional: true },
    student: { label: '学员信息', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService as NgxExcelService<Student>,
      labelKey: 'name', optional: true },
    curriculum: { label: '课程信息', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.curriculumService as NgxExcelService<ProductCurriculum>,
      optional: true },
    subject: { label: '科目信息', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.subjectService as NgxExcelService<ProductSubject>,
      optional: true },
    product: { label: '产品信息', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.productService as NgxExcelService<Product>,
      optional: true },
  };
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected studentService: StudentService,
    protected productService: ProductService,
    protected subjectService: ProductSubjectService,
    protected curriculumService: ProductCurriculumService,
  ) {
    super(httpClient, backendService);
  }
}
