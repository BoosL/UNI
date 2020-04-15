import {Injectable} from '@angular/core';
import {NgxExcelColumnType} from 'ngx-excel';
import {Enums} from './enums';
import {MarketingCustomerService} from '@uni/customer';

@Injectable({ providedIn: 'root' })
export class TmkCustomersService extends MarketingCustomerService {

  protected resourceUri = 'v2/tmk/customers';
  protected resourceName = 'customers';

  protected extendRules = {
    check: {
      label: ' ', columnType: NgxExcelColumnType.Text,
    },
    identity: {
      label: '客户身份', columnType: NgxExcelColumnType.Text,
    },
    endCode: {
      label: '通话判断码', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Tmk.callCode), optional: true
    },
    tmkStatus: {
      label: '状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Tmk.tmkStatus), prop: 'customer_tmk_status', optional: true
    },
    isDuplicate: {
      label: '是否重复单', columnType: NgxExcelColumnType.Bool,
    },
    lastFollowedAt: {
      label: '上次跟进时间', columnType: NgxExcelColumnType.DateTime, prop: 'last_followed_at', optional: true
    },
    nextTime: {
      label: '下次跟进时间', columnType: NgxExcelColumnType.DateTime, optional: true
    },
    allotAt: {
      label: '分配时间', columnType: NgxExcelColumnType.DateTime,
    },
    protectedRemainTime: {
      label: '保护期剩余时间', columnType: NgxExcelColumnType.Text, prop: 'protected_remain_time'
    },
    isPublic: {
      label: '是否公池数据', columnType: NgxExcelColumnType.Bool
    }
  };

  public getRules() {
    return Object.assign({}, super.getRules(), this.extendRules);
  }

}
