import { Injectable } from '@angular/core';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { BankInstalment } from '../models/common.model';

@Injectable()
export class BankInstalmentService extends BaseService<BankInstalment> {

  protected resourceUri = 'banks/{bank_id}/instalments';
  protected resourceName = 'bankInstalments';

  protected rules = {
    id: { label: '银行分期主键', columnType: NgxExcelColumnType.PrimaryKey },
    label: { label: '银行分期名称', columnType: NgxExcelColumnType.Text },
    num: { label: '银行分期期数', columnType: NgxExcelColumnType.Number },
    rate: { label: '分期手续费率', columnType: NgxExcelColumnType.Currency },
    fee: { label: '分期手续费', columnType: NgxExcelColumnType.Currency }
  } as NgxExcelModelColumnRules<BankInstalment>;

}
