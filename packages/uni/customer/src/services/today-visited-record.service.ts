import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { BaseService,
  BackendService,
  Employee,
  EmployeeCcService} from '@uni/core';
import { TodayVisitedRecord } from '../models/today-visited-record.model';
import { MarketingCustomer } from '../models/marketing-customer.model';
import { MarketingCustomerService } from './marketing-customer/marketing-customer';
import { CustomerVisitedRecordService } from './customer-visited-record.service';

@Injectable({ providedIn: 'root' })
export class TodayVisitedRecordService extends BaseService<TodayVisitedRecord> {

  public resourceUri = 'v2/customer/reservation_visitings';
  public resourceName = 'reservation_visitings';

  public rules = {
    id: {
      label: '今日到访主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    cc: {
      label: 'CC', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.employeeCcService as NgxExcelService<Employee>, labelKey: 'name'
    },
    relativeMarketingCustomer: {
      label: '姓名', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService as NgxExcelService<MarketingCustomer>, labelKey: 'name',
      prop: 'customer'
    },
    nextVisitedTime: {
      label: '预约时间', columnType: NgxExcelColumnType.DateTime, prop: 'reservation_time'
    },
    visitedTime: {
      label: '到访时间', columnType: NgxExcelColumnType.DateTime, prop: 'visited_at'
    },
    leaveTime: {
      label: '离校时间', columnType: NgxExcelColumnType.DateTime, prop: 'leaved_at'
    },
    consultingDuration: {
      label: '咨询时长', columnType: NgxExcelColumnType.Number, prop: 'consult_durations', optional: true
    },
    consultingStatus: {
      label: '咨询状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.customerVisitedRecordService.getAllConsultingStatus(), prop: 'consult_status'
    }
  } as NgxExcelModelColumnRules<TodayVisitedRecord>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected employeeCcService: EmployeeCcService,
    protected customerService: MarketingCustomerService,
    protected customerVisitedRecordService: CustomerVisitedRecordService
  ) {
    super(httpClient, backendService);
  }

}
