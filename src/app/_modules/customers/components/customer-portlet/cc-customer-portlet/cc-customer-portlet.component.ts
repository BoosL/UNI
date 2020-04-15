import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {NgxExcelModelColumnRules, NgxExcelComponent, INgxExcelDataSource} from 'ngx-excel';
import { MarketingCustomer, MarketingCustomerService } from '@uni/customer';

@Component({
  selector: 'cc-customer-portlet',
  templateUrl: './cc-customer-portlet.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcCustomerPortletComponent implements OnInit {

  rules: NgxExcelModelColumnRules<MarketingCustomer>;

  @Input() excelComponent: NgxExcelComponent;
  @Input() context: MarketingCustomer;
  @Output() actionButtonClick = new EventEmitter<{ action: string; marketingCustomer: MarketingCustomer }>();

  constructor(
    protected customerService: MarketingCustomerService
  ) { }

  ngOnInit() {
    this.rules = this.customerService.getRules();
  }

  /**
   * 咨询时长转化为分钟显示
   * @param seconds 秒数
   */
  getConsultingDurationMinutes(seconds: number) {
    return Math.round(seconds / 60);
  }

  /**
   * 导航到客户详情
   * @param e 事件
   * @param action 动作
   * @param marketingCustomer 客户信息
   */
  navigateTo(e: Event, action: string, marketingCustomer: MarketingCustomer) {
    e.preventDefault();
    e.stopPropagation();
    this.actionButtonClick.emit({ action, marketingCustomer });
  }

}
