import { Injectable } from '@angular/core';
import { BaseEmployeeService } from '@uni/core';
import { TmkEmployee } from '../models/tmk-employee.model';

@Injectable({ providedIn: 'root' })
export class TmkEmployeeService extends BaseEmployeeService<TmkEmployee> {

  protected resourceUri = 'v2/tmk/staffs';
  protected resourceName = 'staffs';

}
