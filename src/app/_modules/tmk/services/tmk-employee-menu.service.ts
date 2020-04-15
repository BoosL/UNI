import { Injectable } from '@angular/core';
import { AuthService } from '@uni/common';
import { EmployeeMenuService, EmployeeService } from '@uni/core';
import { TmkEmployeeService } from './tmk-employee.service';

@Injectable()
export class TmkEmployeeMenuService extends EmployeeMenuService {

  constructor(
    protected authService: AuthService,
    protected employeeService: EmployeeService,
    protected tmkEmployeeService: TmkEmployeeService
  ) {
    super(authService, employeeService);
  }

  /**
   * @inheritdoc
   */
  protected getAvailableMenuItems() {
    return this.tmkEmployeeService.getList();
  }

}
