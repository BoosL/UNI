import { Injectable } from '@angular/core';
import { NgxExcelDataService } from 'ngx-excel';
import { StudentExt, StudentExtService } from '@uni/student';

@Injectable()
export class StudentPrimaryClassUczeDataService extends NgxExcelDataService<StudentExt> {

  constructor(
    protected excel: StudentExtService,
  ) {
    super();
  }
  /**
   * @inheritdoc
   */
  public getRules() {
    return this.excel.getRules();
  }
}
