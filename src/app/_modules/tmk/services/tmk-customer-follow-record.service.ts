import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { BaseService, BackendService, SchoolService, School } from '@uni/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { TmkCustomerFollowRecord } from '../models/tmk-customer-follow-record.model';
import { Enums } from './enums';
import { map } from 'rxjs/operators';
import { TmkCustomersService } from './tmk-customers.service';
import {TmkCustomerActionCodeService} from './tmk-customer-action-code.service';


@Injectable({ providedIn: 'root' })
export class TmkCustomerFollowRecordService extends BaseService<TmkCustomerFollowRecord> {

  protected resourceUri = 'v2/tmk/customer/{customer_id}/follow';
  protected resourceName = '';
  protected actionCodes = [];

  protected rules = {
    id: {
      label: '主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    actionCode: {
      label: '通话判断', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.tmkCustomerActionCodeService, labelKey: 'name'
    },
    tmkStatus: {
      label: '客户状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Tmk.tmkStatus), prop: 'status'
    },
    content: {
      label: '跟进内容', columnType: NgxExcelColumnType.MultilineText
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
    isEnableNextTime: {
      label: '下次跟进时间是否必填', columnType: NgxExcelColumnType.Bool
    },
    isEnableReservationTime: {
      label: '预约到访时间是否必填', columnType: NgxExcelColumnType.Bool
    },
    relativeMarketingCustomer: {
      label: '关联的客户', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.customerService, labelKey: 'name'
    }
  } as NgxExcelModelColumnRules<TmkCustomerFollowRecord>;
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: SchoolService,
    protected customerService: TmkCustomersService,
    protected tmkCustomerActionCodeService: TmkCustomerActionCodeService
  ) {
    super(httpClient, backendService);
  }
  public getActionCodeForeignModels(model: TmkCustomerFollowRecord) {
    if (this.actionCodes && this.actionCodes.length > 0) {
      return of(this.actionCodes);
    }
    return this.tmkCustomerActionCodeService.getList().pipe(
      map( (actionCodes) => {
        this.actionCodes = actionCodes;
        return actionCodes;
      })
    );
  }
}
