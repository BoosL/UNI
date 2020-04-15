import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { BaseService, BackendService, SchoolService, CustomerService, School, Customer } from '@uni/core';
import { CustomerReservedRecord } from '../models/customer-reserved-record.model';

@Injectable({ providedIn: 'root' })
export class CustomerReservedRecordService extends BaseService<CustomerReservedRecord> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '预约记录主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    school: {
      label: '预约校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>, labelKey: 'name', prop: 'campus'
    },
    nextVisitedTime: {
      label: '预约到访时间', columnType: NgxExcelColumnType.Date, prop: 'reservation_time'
    },
    relativeCustomer: {
      label: '关联的客户', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService as NgxExcelService<Customer>, labelKey: 'name', prop: 'customer'
    }
  } as NgxExcelModelColumnRules<CustomerReservedRecord>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected customerService: CustomerService
  ) {
    super(httpClient, backendService);
  }

}
