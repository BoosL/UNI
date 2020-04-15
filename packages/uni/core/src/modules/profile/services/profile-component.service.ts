import { Injectable } from '@angular/core';
import { EmployeeService } from '../../../logic/logic';

@Injectable()
export class ProfileComponentService {

  constructor(
    protected employeeService: EmployeeService
  ) { }

}
