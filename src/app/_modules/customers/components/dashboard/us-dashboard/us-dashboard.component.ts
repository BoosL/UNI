import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import {
  MarketingCustomerForUsherService,
} from '../../../services/marketing-customer-for-usher.service';
import {
  MarketingCustomerService,
  TodayVisitedRecordService,
  MarketingCustomer,
  TodayVisitedRecord
} from '@uni/customer';
import { BaseCustomerWrapperComponent } from '../../base-customer-wrapper-component';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'us-dashboard',
  templateUrl: './us-dashboard.component.html',
  providers: [
    { provide: MarketingCustomerService, useClass: MarketingCustomerForUsherService },
    { provide: INgxExcelDataSource, useExisting: TodayVisitedRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsDashboardComponent extends BaseCustomerWrapperComponent implements OnInit, OnDestroy, AfterViewInit {

  pageTitle: string;
  pageBreadcrumb: Array<{ label: string }>;

  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  // tslint:disable-next-line: variable-name
  private _componentSubscription = new Subscription();

  ngOnInit() {
    this.initSchemeConfig();
    this.pageTitle = this.activatedRoute.snapshot.data.pageTitle;
    this.pageBreadcrumb = this.activatedRoute.snapshot.data.pageBreadcrumb;
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const reloadSubscription = this.schoolMenuService.currentSchool$.pipe(
      filter((school) => !!school && school.id !== '-1'),
      map((school) => school.id),
      distinctUntilChanged()
    ).subscribe(
      () => this._reload(),
      (e) => this.message.error(e.message || '系统错误，请联系管理员！')
    );
    this._componentSubscription.add(reloadSubscription);
  }

  /**
   * 咨询时长转化为分钟显示
   * @param seconds 秒数
   */
  getConsultingDurationMinutes(seconds: number) {
    return Math.round(seconds / 60);
  }

  /**
   * 当新增客户按钮被点击时执行
   * @param e 事件
   */
  handleAddButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.handleActionButtonClick({ action: 'create', marketingCustomer: null });
  }

  /**
   * 当客户到访按钮被点击时执行
   * @param e 事件
   */
  handleAppendVisitedRecordButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.handleActionButtonClick({ action: 'appendVisitedRecordModal', marketingCustomer: null });
  }

  /**
   * 当客户没有到访时间时允许增加到访记录
   */
  handleVisitedTimeClick = (record: TodayVisitedRecord) => {
    if (record.visitedTime) { return; }
    this.handleActionButtonClick({ action: 'appendVisitedRecordModal', marketingCustomer: record.relativeMarketingCustomer });
  }

  /**
   * 当客户有到访时间但是没有离校时间时允许进行离校操作
   */
  handleLeaveTimeClick = (record: TodayVisitedRecord) => {
    if (!record.visitedTime || record.leaveTime) { return; }
    this.handleActionButtonClick({ action: 'appendVisitedLeaveRecordModal', marketingCustomer: record.relativeMarketingCustomer });
  }

  /**
   * 新增客户到访记录后的回调
   * @param _ 当前客户
   */
  protected appendVisitedRecordCallback(_: MarketingCustomer) {
    this._reload();
  }

  /**
   * @inheritdoc
   */
  protected create() {
    this.router.navigate(['../us-customers/_create'], { relativeTo: this.activatedRoute });
  }

  /**
   * 重新加载表格数据
   */
  private _reload() {
    const currentSchool = this.schoolMenuService.currentSchool;
    if (!this.excelComponent || !currentSchool || currentSchool.id === '-1') { return; }
    this.excelComponent.bindFilters({ campus_ids: currentSchool.id }).reload();
  }
}
