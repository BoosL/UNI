import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType } from 'ngx-excel';
import { BackendService } from '../../../services/backend.service';
import { StudentBoughtCurriculum } from '../../models/student-bought-curriculum-manager.model';
import { BaseProductCurriculumService } from '../curriculum-manager/curriculum-manager'
import { StudentBoughtProductService } from './student-bought-product.service';
import { StudentBoughtSubjectService } from './student-bought-subject.service';

@Injectable()
export class StudentBoughtCurriculumService extends BaseProductCurriculumService<StudentBoughtCurriculum> {

  protected resourceUri = 'campuses/{school_id}/students/{student_id}/bought_products/{product_id}/subjects/{subject_id}/curriculums';
  protected resourceName = 'bought_curriculums';

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
    }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected productService: StudentBoughtProductService,
    protected subjectService: StudentBoughtSubjectService
  ) {
    super(httpClient, backendService, productService, subjectService);
  }

}
