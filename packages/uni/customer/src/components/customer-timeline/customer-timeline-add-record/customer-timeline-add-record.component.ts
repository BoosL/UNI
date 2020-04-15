import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent} from 'ngx-excel';
import {
  MarketingCustomer,
} from '../../../models/marketing-customer.model';
import {MarketingCustomerService} from '../../../services/marketing-customer/marketing-customer.service';

@Component({
  selector: 'customer-timeline-add-record',
  templateUrl: './customer-timeline-add-record.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineAddRecordComponent implements OnInit {

  rules: NgxExcelModelColumnRules<MarketingCustomer>;

  @Input() record: MarketingCustomer;
  @Input() excel: NgxExcelComponent;

  constructor(
    protected customerService: MarketingCustomerService
  ) {
  }

  ngOnInit() {
    this.rules = this.customerService.getRules();
  }

}
