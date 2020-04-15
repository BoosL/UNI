import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import {
  BaseService,
  BackendService
} from '@uni/core';
import { MarketingCustomer } from '../models/marketing-customer.model';
import { CustomerConsultingRecordModel } from '../models/customer-consulting-record.model';
import { MarketingCustomerService } from './marketing-customer/marketing-customer';
import { Enums } from './enums';

@Injectable({ providedIn: 'root' })
export class CustomerConsultingRecordService extends BaseService<CustomerConsultingRecordModel> {

  protected resourceUri = 'v2/customer/cc/consults';
  protected resourceName = 'consults';

  protected rules = {
    id: {
      label: '咨询记录主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    visitingPurpose: {
      label: '来访目的', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CustomerConsultingRecord.VisitingPurpose)
    },
    englishDegree: {
      label: '英语程度', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CustomerConsultingRecord.EnglishDegree)
    },
    monthlyDisposableIncome: {
      label: '月均可支配收入', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CustomerConsultingRecord.MonthlyDisposableIncome), prop: 'pmdi'
    },
    backgroundInfo: {
      label: '工作/学习/家庭背景描述', columnType: NgxExcelColumnType.MultilineText
    },
    course: {
      label: '是否推荐课程', columnType: NgxExcelColumnType.Bool
    },
    courseType: {
      label: '课程类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Customer.CurriculumType)
    },
    courseCount: {
      label: '课时数（节）', columnType: NgxExcelColumnType.Number
    },
    courseMonth: {
      label: '学习时长（月）', columnType: NgxExcelColumnType.TextNumber
    },
    offerPriceStatus: {
      label: '是否报价', columnType: NgxExcelColumnType.Bool
    },
    offerPrice: {
      label: '报价金额', columnType: NgxExcelColumnType.Number
    },
    invalidationReason: {
      label: '废turn理由', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.CustomerConsultingRecord.InvalidationReason)
    },
    invalidationRemark: {
      label: '废turn描述', columnType: NgxExcelColumnType.MultilineText
    },
    attachments: {
      label: '附件', columnType: NgxExcelColumnType.MultiUploadFile, acceptedFileCount: 5,
      acceptedFileSize: 2048, acceptedFileType: ['.jpg', '.jpeg', '.png', '.bmp', '.mp3'], prop: 'records'
    },
    contractRate: {
      label: '签约几率', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerService.getContractRates()
    },
    isImportant: {
      label: '重要客户', columnType: NgxExcelColumnType.Bool
    },
    reasonForAbandoning: {
      label: '未咨描述', columnType: NgxExcelColumnType.MultilineText, prop: 'no_consultation_remark'
    },
    relativeMarketingCustomer: {
      label: '关联的客户', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService as NgxExcelService<MarketingCustomer>, labelKey: 'name'
    }
  } as NgxExcelModelColumnRules<CustomerConsultingRecordModel>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected customerService: MarketingCustomerService
  ) {
    super(httpClient, backendService);
  }


}
