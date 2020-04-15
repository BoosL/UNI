import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerInfoComponent implements OnInit {

  @Input() customer$: Observable<MarketingCustomer>;

  constructor() { }

  ngOnInit() { }

}

