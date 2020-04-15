import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {NgxExcelModelColumnRules, NgxExcelComponent, INgxExcelDataSource} from 'ngx-excel';
import { MarketingCustomer, MarketingCustomerService } from '@uni/customer';

@Component({
  selector: 'so-customer-portlet',
  templateUrl: './so-customer-portlet.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoCustomerPortletComponent implements OnInit {

  rules: NgxExcelModelColumnRules<MarketingCustomer>;

  @Input() excelComponent: NgxExcelComponent;
  @Input() context: MarketingCustomer;
  @Input() simpleMode: boolean;
  @Output() actionButtonClick = new EventEmitter<{ action: string; marketingCustomer: MarketingCustomer }>();

  constructor(
    protected customerService: MarketingCustomerService
  ) { }

  ngOnInit() {
    this.rules = this.customerService.getRules();
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
