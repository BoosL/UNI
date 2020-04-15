import { Injectable } from '@angular/core';
import { NgxExcelDataService } from 'ngx-excel';
import { CustomerSource } from '@uni/core';
import { TmkEmployeeConfig } from '../../models/tmk-employee.model';
import { TmkEmployeeConfigService } from '../../services/tmk-employee-config.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TmkEmployeeConfigDataService extends NgxExcelDataService<TmkEmployeeConfig> {


  constructor(
    protected employeeConfigService: TmkEmployeeConfigService
  ) {
    super();
  }

  public getRules() {
    return this.employeeConfigService.getRules();
  }

}
