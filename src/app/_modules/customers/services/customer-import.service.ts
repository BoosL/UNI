import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BaseService, BackendService } from '@uni/core';
import { CustomerImport } from '../models/customer-import.model';
import { Enums } from '../../_enums';

@Injectable({ providedIn: 'root' })
export class CustomerImportService extends BaseService<CustomerImport> {

  protected resourceUri = 'v2/customer/import_status';
  protected resourceName = 'import_status';

  protected rules = {
    id: { label: '客户导入状态主键', columnType: NgxExcelColumnType.PrimaryKey },
    chName: {
      label: '客户中文名',
      columnType: NgxExcelColumnType.Text,
      prop: 'chinese_name'
    },
    enName: {
      label: '客户英文名',
      columnType: NgxExcelColumnType.Text,
      prop: 'english_name'
    },
    mobile: {
      label: '手机号码',
      columnType: NgxExcelColumnType.Text,
    },
    message: {
      label: '反馈信息',
      columnType: NgxExcelColumnType.MultilineText,
    },
    status: {
      label: '导入状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.ImportCustomer.ImportCustomerStatus),
    },
    isImplement: {
      label: '执行状态',
      columnType: NgxExcelColumnType.Text,
      prop: 'is_implement'
    },
    created_at: {
      label: '导入时间',
      columnType: NgxExcelColumnType.Text
    }
  } as NgxExcelModelColumnRules<CustomerImport>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
  ) {
    super(httpClient, backendService);
  }

}
