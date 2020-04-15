import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelService, NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import {
  BackendService,
  BaseService,
  EmployeeService,
  SchoolMenuService
} from '@uni/core';
import { TmkCustomersMigrate } from '../models/tmk-customers-migrate.model';
import { of } from 'rxjs';
import {TmkEmployeeService} from './tmk-employee.service';
import {TmkEmployee} from '../models/tmk-employee.model';

@Injectable({ providedIn: 'root' })
export class TmkCustomersMigrateService extends BaseService<TmkCustomersMigrate> {

  protected resourceUri = 'v2/tmk/customer/migrate';
  protected resourceName = '';

  protected rules = {
    action: {
      label: '', columnType: NgxExcelColumnType.Text
    },
    fromTmk: {
      label: '转出人',
      columnType: NgxExcelColumnType.ForeignKey, relativeService: this.employeeService as NgxExcelService<TmkEmployee>,
      labelKey: 'name'
    },
    targetTmk: {
      label: '接收人',
      columnType: NgxExcelColumnType.ForeignKey, relativeService: this.employeeService as NgxExcelService<TmkEmployee>,
      labelKey: 'name'
    },
    customers: {
      label: '需要转移的客户列表', columnType: NgxExcelColumnType.Text
    },
    allCustomers: {
      label: '是否全部用户', columnType: NgxExcelColumnType.Bool
    },
    count: {
      label: '分配数据', columnType: NgxExcelColumnType.Text
    },
    migrateCount: {
      label: '转移数据', columnType: NgxExcelColumnType.Text, optional: true
    },
  } as NgxExcelModelColumnRules<TmkCustomersMigrate>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected employeeService: TmkEmployeeService,
    protected schoolMenuService: SchoolMenuService
  ) {
    super(httpClient, backendService);
  }

}
