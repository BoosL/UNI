import { Injectable } from '@angular/core';
import { NgxExcelDataService } from 'ngx-excel';
import { EmployeeOrganizationPositionService, EmployeeOrganizationPosition } from '../../../logic/logic';

@Injectable()
export class EmployeeRelativeOPDataSource extends NgxExcelDataService<EmployeeOrganizationPosition> {

  constructor(
    protected employeeOPService: EmployeeOrganizationPositionService
  ) {
    super();
  }

  /**
   * @inheritdoc
   */
  public getRules() {
    return this.employeeOPService.getRules();
  }

}
