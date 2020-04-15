import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService} from 'ngx-excel';
import {
  BaseService,
  BackendService
} from '@uni/core';
import {MarketingCustomer} from '../models/marketing-customer.model';
import {CustomerFollowRecord} from '../models/customer-follow-record.model';
import {MarketingCustomerService} from './marketing-customer/marketing-customer';
import {Enums} from './enums';

@Injectable({ providedIn: 'root' })
export class CustomerFollowRecordService extends BaseService<CustomerFollowRecord> {

  protected resourceUri = 'v2/customer/cc/follows';
  protected resourceName = 'follows';

  protected rules = {
    id: {
      label: '跟进记录主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    type: {
      label: '跟进形式', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CustomerFollowRecord.Type)
    },
    duration: {
      label: '沟通时长', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CustomerFollowRecord.Duration)
    },
    isInvite: {
      label: '是否邀约到访？', columnType: NgxExcelColumnType.Bool, prop: 'is_reservation', optional: true
    },
    inviteFailedReason: {
      label: '邀约失败原因', columnType: NgxExcelColumnType.MultilineText, optional: true
    },
    nextVisitedTime: {
      label: '预约到访时间', columnType: NgxExcelColumnType.Date, prop: 'reservation_time', optional: true
    },
    nextFollowBeginTime: {
      label: '下次跟进开始时间', columnType: NgxExcelColumnType.DateTime, prop: 'next_follow_time_start'
    },
    nextFollowEndTime: {
      label: '下次跟进截止时间', columnType: NgxExcelColumnType.DateTime, prop: 'next_follow_time_end'
    },
    contractRate: {
      label: '签约几率', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getContractRates()
    },
    attachments: {
      label: '附件', columnType: NgxExcelColumnType.MultiUploadFile, acceptedFileCount: 5,
      acceptedFileSize: 800, acceptedFileType: ['.jpg', '.jpeg', '.png', '.bmp'],
      prop: 'records'
    },
    remark: {
      label: '特殊备注', columnType: NgxExcelColumnType.MultilineText, optional: true
    },
    reasonForAbandoning: {
      label: '放弃原因', columnType: NgxExcelColumnType.MultilineText
    },
    relativeMarketingCustomer: {
      label: '关联的客户', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService as NgxExcelService<MarketingCustomer>, labelKey: 'name'
    }
  } as NgxExcelModelColumnRules<CustomerFollowRecord>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected customerService: MarketingCustomerService
  ) {
    super(httpClient, backendService);
  }

}
