import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { BackendService } from '../../../services/backend.service';
import { Employee } from '../../models/employee.model';
import { StudentBoughtSubject } from '../../models/student-bought-curriculum-manager.model';
import { EmployeeService } from '../employee/employee.service';
import { BaseProductSubjectService } from '../curriculum-manager/curriculum-manager';
import { StudentBoughtProductService } from './student-bought-product.service';

@Injectable()
export class StudentBoughtSubjectService extends BaseProductSubjectService<StudentBoughtSubject> {

  protected resourceUri = 'campuses/{school_id}/students/{student_id}/bought_products/{product_id}/subjects';
  protected resourceName = 'bought_subjects';

  protected additionalRules = {
    startTime: {
      label: '开始时间', columnType: NgxExcelColumnType.Date
    },
    endTime: {
      label: '结束时间', columnType: NgxExcelColumnType.Date
    },
    remainedCurriculumCount: {
      label: '剩余课时', columnType: NgxExcelColumnType.Number, optional: true
    },
    consumedCurriculumCount: {
      label: '已消课时', columnType: NgxExcelColumnType.Number, optional: true
    },
    lockedCurriculumCount: {
      label: '锁定课时', columnType: NgxExcelColumnType.Number, optional: true
    },
    overdueCurriculumCount: {
      label: '过期课时', columnType: NgxExcelColumnType.Number, optional: true
    },
    deprecatedCurriculumCount: {
      label: '作废课时', columnType: NgxExcelColumnType.Number, optional: true
    },
    curriculumCount: {
      label: '总课时', columnType: NgxExcelColumnType.Number
    },
    relativeTeacher: {
      label: '关联的老师', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService as NgxExcelService<Employee>, labelKey: 'name', prop: 'teacher'
    }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: StudentBoughtProductService,
    protected employeeService: EmployeeService
  ) {
    super(httpClient, backendService, productService);
  }

}
