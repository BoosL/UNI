import { Injectable } from '@angular/core';
import { BaseEmployeeService } from './employee.service';
import { Employee } from '../../models/employee.model';

@Injectable()
export class EmployeeCdService extends BaseEmployeeService<Employee> {

  protected resourceUri = 'v2/campuses/{school_id}/cd';
  protected resourceName = 'staff';

}
