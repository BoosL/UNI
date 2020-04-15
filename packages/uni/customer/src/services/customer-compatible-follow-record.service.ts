import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService, BackendService, SchoolService, School } from '@uni/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { CustomerCompatibleFollowRecord } from '../models/customer-compatible-follow-record.model';
import {Enums} from './enums';

@Injectable({ providedIn: 'root' })
export class CustomerCompatibleFollowRecordService extends BaseService<CustomerCompatibleFollowRecord> {

  protected resourceUri = '';
  protected resourceName = '';

  protected rules = {
    id: {
      label: '兼容的跟进记录主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    content: {
      label: '跟进内容', columnType: NgxExcelColumnType.MultilineText, optional: true
    },
    school: {
      label: '预约校区', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.schoolService as NgxExcelService<School>, labelKey: 'name', prop: 'campus', optional: true
    },
    nextFollowTime: {
      label: '下次跟进时间', columnType: NgxExcelColumnType.DateTime, prop: 'next_time'
    },
    nextVisitedTime: {
      label: '预约到访时间', columnType: NgxExcelColumnType.DateTime, prop: 'reservation_time', optional: true
    },
    endCode: {
      label: '通话结束码',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Tmk.callCode),
      optional: true
    },
    status: {
      label: '客户状态',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Tmk.tmkStatus),
      prop: 'customer_tmk_status',
      optional: true
    }
  } as NgxExcelModelColumnRules<CustomerCompatibleFollowRecord>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService
  ) {
    super(httpClient, backendService);
  }

}
