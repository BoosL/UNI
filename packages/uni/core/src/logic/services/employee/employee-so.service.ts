import { Injectable } from '@angular/core';
import { BaseEmployeeService } from './employee.service';
import { Employee } from '../../models/employee.model';

@Injectable()
export class EmployeeSoService extends BaseEmployeeService<Employee> {

  protected resourceUri = 'v2/customer/source/staffs';
  protected resourceName = 'staff';

}
