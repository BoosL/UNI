import { Injectable } from '@angular/core';
import { BaseEmployeeService } from './employee.service';
import { Employee } from '../../models/employee.model';

@Injectable()
export class EmployeeCcService extends BaseEmployeeService<Employee> {

  protected resourceUri = 'v2/campuses/{school_id}/cc';
  protected resourceName = 'staff';

}
