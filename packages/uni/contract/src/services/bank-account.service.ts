import { Injectable } from '@angular/core';
import { BaseService, BackendService } from '@uni/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';
import { BankAccount } from '../models/bank-account.model';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class BankAccountService extends BaseService<BankAccount> {

    protected resourceUri   = 'finance/available_schools/{school_id}/bank_accounts';
    protected resourceName  = 'bank_accounts';
    protected rules = {
        id:     { label: '账户主键', columnType: NgxExcelColumnType.PrimaryKey },
        name:   { label: '账户名称', columnType: NgxExcelColumnType.Text },
        code:   { label: '内部简称', columnType: NgxExcelColumnType.Text }
    } as NgxExcelModelColumnRules<BankAccount>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
  ) {
    super(httpClient, backendService);
  }

}
