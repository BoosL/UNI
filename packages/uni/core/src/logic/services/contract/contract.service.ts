import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import {NgxExcelColumnType} from 'ngx-excel';
import {BaseSchoolService} from '../school.service';
import {BaseStudentService} from '../student.service';
import {BaseEmployeeService} from '../employee/employee.service';
import {Contract} from '../../models/contract.model';
import {BaseContractService} from './base-contract.service';
import {Enums} from '../../enums';
import {BaseSchool} from '../../models/school.model';
import {BaseStudent} from '../../models/student.model';
import {BaseEmployee} from '../../models/employee.model';

@Injectable({providedIn: 'root'})
export class ContractService<T extends Contract> extends BaseContractService<Contract> {
  protected resourceUri = '';
  protected resourceName = '';
  protected additionalRules = {
    relativeStudent: {
      label: '签署学员', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.studentService, labelKey: 'name',
      prop: 'student'
    },
    relativeEmployee: {
      label: '签署员工', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService, labelKey: 'name',
      prop: 'staff',
    },
    levelEtp: {
      label: 'Etp等级', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Product.EtpLevel),
      prop: 'level'
    },
    relativeSchool: {
      label: '关联校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService , labelKey: 'name',
      prop: 'campus'
    },
  };
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: BaseSchoolService<BaseSchool>,
    protected studentService: BaseStudentService<BaseStudent>,
    protected employeeService: BaseEmployeeService<BaseEmployee>,
  ) {
    super(httpClient, backendService);
  }
}
