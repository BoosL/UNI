import {Injectable} from '@angular/core';
import {AuthService} from '@uni/common';
import {SchoolMenuService, EmployeeService} from '@uni/core';
import {Observable} from 'rxjs';
import {ContractSchoolService} from './contract-school.service';
import {ContractSchool} from '../models/contract-school.model';

@Injectable()
export class ContractSchoolMenuService extends SchoolMenuService {
  constructor(
    protected authService: AuthService,
    protected employeeService: EmployeeService,
    protected schoolService: ContractSchoolService
  ) {
    super(authService, employeeService);
  }
  /**
   * @inheritdoc
   */
  protected getAvailableMenuItems(): Observable<ContractSchool[]> {
    return this.schoolService.getList();
  }

}
