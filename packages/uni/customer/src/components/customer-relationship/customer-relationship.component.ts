import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelContextComponent } from 'ngx-excel';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { MarketingCustomerService} from '../../services/marketing-customer/marketing-customer.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'customer-relationship',
  templateUrl: './customer-relationship.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerRelationshipComponent implements OnInit {

  rules: NgxExcelModelColumnRules<MarketingCustomer>;

  @Input() customer$: Observable<MarketingCustomer>;
  @Input() attachSelectTo: NgxExcelContextComponent;

  constructor(
    protected customerService: MarketingCustomerService
  ) { }

  ngOnInit() {
    this.rules = this.customerService.getRules();
  }

}
