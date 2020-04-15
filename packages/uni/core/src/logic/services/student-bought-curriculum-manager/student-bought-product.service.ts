import { Injectable } from '@angular/core';
import { NgxExcelColumnType } from 'ngx-excel';
import { StudentBoughtProduct } from '../../models/student-bought-curriculum-manager.model';
import { BaseProductService } from '../curriculum-manager/curriculum-manager';

@Injectable()
export class StudentBoughtProductService extends BaseProductService<StudentBoughtProduct> {

  protected resourceUri = 'campuses/{school_id}/students/{student_id}/bought_products';
  protected resourceName = 'bought_products';

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

}
