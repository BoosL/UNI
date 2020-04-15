import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService, BackendService } from '@uni/core';
import { TmkCustomerStats, TmkCustomersStatsDetail } from '../models/tmk-customer-stats.model';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
@Injectable({ providedIn: 'root' })
export class TmkStatsDetailService extends BaseService<TmkCustomersStatsDetail> {
  protected resourceUri = '';
  protected resourceName = '';
  protected rules = {
    all: {
      label: '', columnType: NgxExcelColumnType.Text
    },
    finish: {
      label: '', columnType: NgxExcelColumnType.Text
    }
  } as NgxExcelModelColumnRules<TmkCustomersStatsDetail>;
}
@Injectable({ providedIn: 'root' })
export class TmkCustomerStatsService extends BaseService<TmkCustomerStats> {
  protected resourceUri = 'v2/tmk/dashbroad';
  protected resourceName = '';
  protected rules = {
    todayFollows: {
      label: '今日需跟进', columnType: NgxExcelColumnType.ForeignKey, relativeService: this.tmkStatsDetailService
    },
    todayNews: {
      label: '今日新单分配', columnType: NgxExcelColumnType.ForeignKey, relativeService: this.tmkStatsDetailService
    },
    todayTransferred: {
      label: '今日流转分配', columnType: NgxExcelColumnType.ForeignKey, relativeService: this.tmkStatsDetailService
    },
    thirtyDayReservation: {
      label: '30日内成功预约', columnType: NgxExcelColumnType.ForeignKey, relativeService: this.tmkStatsDetailService, prop: '30dayReservation'
    },
    needCall: {
      label: '应拨未拨', columnType: NgxExcelColumnType.ForeignKey, relativeService: this.tmkStatsDetailService
    },
    sevenDayRecycling: {
      label: '7日内回收数据', columnType: NgxExcelColumnType.ForeignKey, relativeService: this.tmkStatsDetailService, prop: '7dayRecycling'
    }
  } as NgxExcelModelColumnRules<TmkCustomerStats>;
  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected tmkStatsDetailService: TmkStatsDetailService
  ) {
    super(httpClient, backendService);
  }
}
