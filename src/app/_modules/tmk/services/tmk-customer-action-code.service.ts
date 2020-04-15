import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService, BackendService } from '@uni/core';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import {TmkCustomerActionCode} from '../models/tmk-customer-action-code.model';

@Injectable({ providedIn: 'root' })
export class TmkCustomerActionCodeService extends BaseService<TmkCustomerActionCode> {
  protected resourceUri = 'v2/tmk/follow/action_codes';
  protected resourceName = 'action_code';
  protected rules = {
    id: {
      label: '值', columnType: NgxExcelColumnType.PrimaryKey, prop: 'value'
    },
    name: {
      label: '中文', columnType: NgxExcelColumnType.Text, prop: 'label'
    },
  } as NgxExcelModelColumnRules<TmkCustomerActionCode>;
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
  ) {
    super(httpClient, backendService);
  }
}
