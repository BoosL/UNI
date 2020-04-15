import { Injectable } from '@angular/core';
import { BaseService } from '@uni/core';
import { MarketingCustomerCcrn } from '../../models/marketing-customer.model';
import { NgxExcelModelColumnRules, NgxExcelColumnType } from 'ngx-excel';

@Injectable({ providedIn: 'root' })
export class MarketingCustomerCcrnService extends BaseService<MarketingCustomerCcrn> {

  protected resourceUri = 'v2/customer/staff/_current/ccrn';
  protected resourceName = 'ccrn';

  protected rules = {
    depositConfig: {
      label: '订金配置', columnType: NgxExcelColumnType.Text,
      resolveValue: (o: any) => this.resolveDepositConfig(o)
    },
    nextStepConfig: {
      label: '下一步配置', columnType: NgxExcelColumnType.Text,
      resolveValue: (o: any) => this.resolveNextStepConfig(o)
    },
    id: {
      label: '主键', columnType: NgxExcelColumnType.PrimaryKey,
      resolveValue: (o: any, model: Partial<MarketingCustomerCcrn>) => this.resolveId(o, model)
    }
  } as NgxExcelModelColumnRules<MarketingCustomerCcrn>;

  protected resolveId(o: any, model: Partial<MarketingCustomerCcrn>) {
    return `${o.role_id}-${o.source_id}-${model.depositConfig}`;
  }

  protected resolveDepositConfig(o: any) {
    let result = 'null';
    switch (o.has_deposit) {
      case '*': result = 'any'; break;
      case 0: result = 'false'; break;
      case 1: result = 'true'; break;
      default: result = 'null';
    }
    return result;
  }

  protected resolveNextStepConfig(o: any) {
    let result = 'null';
    switch (o.next_step) {
      case 'to_cc': result = 'to_cc'; break;
      case 'to_cd': result = 'to_cd'; break;
      case 'to_tmk': result = 'to_tmk'; break;
      case 'to_tmk_pool': result = 'to_tmk_pool'; break;
      default: result = 'null';
    }
    return result;
  }

}
