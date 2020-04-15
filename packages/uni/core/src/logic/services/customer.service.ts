import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { BackendService } from '../../services/backend.service';
import { BaseCustomer, Customer } from '../models/customer.model';
import { School } from '../models/school.model';
import { SchoolService } from './school.service';

export abstract class BaseCustomerService<T extends BaseCustomer> extends BaseService<T> {

  protected rules = {
    id: {
      label: '客户主键', columnType: NgxExcelColumnType.PrimaryKey,
      prop: 'customer_id'
    },
    nameCn: {
      label: '中文名称', columnType: NgxExcelColumnType.Text,
      prop: 'chinese_name'
    },
    nameEn: {
      label: '英文名称', columnType: NgxExcelColumnType.Text,
      prop: 'english_name', optional: true
    },
    name: {
      label: '客户姓名', columnType: NgxExcelColumnType.Text,
      resolveValue: (_: any, model: Partial<T>) => this.resolveFullName(model)
    },
    school: {
      label: '所属校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>, labelKey: 'name',
      prop: 'campus'
    }
  } as NgxExcelModelColumnRules<T>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService
  ) {
    super(httpClient, backendService);
  }

  protected resolveFullName(model: Partial<T>) {
    if (model.nameCn && model.nameEn) {
      return `${model.nameCn} (${model.nameEn})`;
    }
    return model.nameCn || model.nameEn || '';
  }

}

@Injectable()
export class CustomerService extends BaseCustomerService<Customer> {

  protected resourceUri = '/campuses/{school_id}/customers';
  protected resourceName = 'customer';

}
