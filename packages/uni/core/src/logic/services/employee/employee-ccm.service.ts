import { Injectable } from '@angular/core';
import { BaseEmployeeService } from './employee.service';
import { Employee } from '../../models/employee.model';

@Injectable()
export class EmployeeCcmService extends BaseEmployeeService<Employee> {

  protected resourceUri = 'v2/campuses/{school_id}/ccm';
  protected resourceName = 'staff';

}
