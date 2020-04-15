import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { BackendService } from '../../services/backend.service';
import { Bank } from '../models/common.model';
import { BankInstalmentService } from './bank-instalment.service';

@Injectable()
export class BankService extends BaseService<Bank> {

  protected resourceUri = 'banks';
  protected resourceName = 'banks';

  protected rules = {
    id: { label: '银行主键', columnType: NgxExcelColumnType.PrimaryKey },
    name: { label: '银行名称', columnType: NgxExcelColumnType.Text },
    instalments: {
      label: '分期信息', columnType: NgxExcelColumnType.MultiForeignKey,
      relativeService: this.bankInstalmentService, labelKey: 'name'
    }
  } as NgxExcelModelColumnRules<Bank>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected bankInstalmentService: BankInstalmentService
  ) {
    super(httpClient, backendService);
  }

}
