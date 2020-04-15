import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType, NgxExcelModelColumnRules, NgxExcelService } from 'ngx-excel';
import { Enums } from './enums';
import { TmkCustomersSearch } from '../models/tmk-customers-search.model';
import {
  CustomersSearchService,
  CustomersSearch,
  MarketingCustomerService,
  CustomerSourceStatelessService
} from '@uni/customer';
import { of } from 'rxjs';
import {AuthService} from '@uni/common';
import {
  School,
  Employee,
  BackendService,
  SchoolMenuService,
  EmployeeCcService,
  EmployeeSoService,
  SchoolService,
  SchoolMenu,
  EmployeeService
} from '@uni/core';
import {TmkEmployeeService} from './tmk-employee.service';

@Injectable({ providedIn: 'root' })
export class TmkCustomersSearchService extends CustomersSearchService {

  protected resourceUri = '';
  protected resourceName = '';

  protected extendRules = {
    callCode: {
      name: 'callCode', label: '通话判断', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Tmk.callCode), optional: true, prop: 'end_code'
    },
    lastFollowRange: {
      name: 'lastFollowRange', label: '上次跟进时间', columnType: NgxExcelColumnType.DateRange, prop: 'last_follow_at', optional: true
    },
    tmkTimeRange: {
      name: 'tmkTimeRange', label: '分配时间', columnType: NgxExcelColumnType.DateRange, prop: 'allot_at', optional: true
    },
    nextTimeRange: {
      name: 'nextTimeRange', label: '下次跟进时间', columnType: NgxExcelColumnType.DateRange, prop: 'next_time', optional: true
    },
    tmkStatus: {
      name: 'tmkStatus', label: '客户状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Tmk.tmkStatus), optional: true, prop: 'customer_tmk_status'
    },
    isDuplicate: {
      name: 'isDuplicate', label: '是否重复单', columnType: NgxExcelColumnType.Bool, optional: true
    },
    school: {
      name: 'school', label: '所属校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService, labelKey: 'name',
      prop: 'campus', optional: true
    },
    tmk: {
      name: 'tmk', label: '跟进人', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.tmkEmployeeService, labelKey: 'name', optional: true
    }
  };
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolMenuService: SchoolMenuService,
    protected customerService: MarketingCustomerService,
    protected customerSourceService: CustomerSourceStatelessService,
    protected employeeCcService: EmployeeCcService,
    protected employeeSoService: EmployeeSoService,
    protected schoolService: SchoolService,
    protected authService: AuthService,
    protected tmkEmployeeService: TmkEmployeeService,
    protected employeeService: EmployeeService
  ) {
    super(httpClient, backendService, schoolMenuService, customerService, customerSourceService, employeeCcService, employeeSoService);
  }

  public getRules() {
    return Object.assign({}, super.getRules(), this.extendRules);
  }
  getSchoolForeignModels(model: TmkCustomersSearch, keyword?: string) {
    const schoolMenuItems: SchoolMenu[] = [];
    const employee = this.getCurrentEmployee();
    if (employee) {
      schoolMenuItems.push(...employee.relativeSchools);
    }
    return of(schoolMenuItems);
  }
  /**
   * 获得当前登陆员工
   */
  protected getCurrentEmployee(): Employee {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? this.employeeService.createModel(null, currentUser) : null;
  }
  /**
   * 获得过滤条件
   */
  public getConditions(model: Partial<TmkCustomersSearch>) {
    const conditions = super.getConditions(model as Partial<CustomersSearch>);
    // tslint:disable: no-string-literal
    conditions['last_followed_at'] = conditions['last_follow_at'];
    conditions['created_at'] = conditions['last_added_at'];
    delete conditions['last_added_at'];
    delete conditions['last_follow_at'];
    return conditions;
  }

}
