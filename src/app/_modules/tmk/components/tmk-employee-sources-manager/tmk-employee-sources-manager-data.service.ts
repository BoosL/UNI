import { Injectable } from '@angular/core';
import { NgxExcelDataService } from 'ngx-excel';
import { CustomerSource } from '@uni/core';
import { TmkEmployeeSourceService } from '../../services/tmk-employee-source.service';

@Injectable()
export class TmkEmployeeSourcesManagerDataService extends NgxExcelDataService<CustomerSource> {

  constructor(
    protected employeeSourceService: TmkEmployeeSourceService
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.employeeSourceService.getRules();
  }

}
