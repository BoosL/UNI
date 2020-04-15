import { Injectable } from '@angular/core';
import { NgxExcelDataService } from 'ngx-excel';

import { StudentPrimaryProduct, PrimaryClassProductService } from '@uni/student';

@Injectable()
export class StudentPrimaryClassProductDataService extends NgxExcelDataService<StudentPrimaryProduct> {

  constructor(
    protected excel: PrimaryClassProductService,
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
