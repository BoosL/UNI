import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BaseStudentService, BackendService, EmployeeService, BaseStudent} from '@uni/core';
import {NgxExcelColumnType} from 'ngx-excel';

@Injectable({ providedIn: 'root' })
export class ContractStudentService extends BaseStudentService<BaseStudent> {

  protected resourceUri = 'finance/available_students';
  protected resourceName = 'available_students';
  protected extendsRules = {
    sc: {
      name: 'sc', label: '已分配SC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService, labelKey: 'name', typeaheadKey: 'name', prop: 'sc',
      optional: true
    },
    cc: {
      name: 'cc', label: '已分配CC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeService, labelKey: 'name', typeaheadKey: 'name', prop: 'cc',
      optional: true
    },
  };
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected employeeService: EmployeeService
  ) {
    super(httpClient, backendService);
  }
  public getRules() {
    return Object.assign({}, this.extendsRules, super.getRules());
  }
}
