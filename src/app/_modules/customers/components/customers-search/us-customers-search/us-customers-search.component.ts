import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { INgxExcelDataSource } from 'ngx-excel';
import { CustomersSearchService } from '@uni/customer';
import { BaseCustomersSearchComponent } from '../base-customers-search-component';

@Component({
  selector: 'us-customers-search.customers-search',
  templateUrl: './us-customers-search.component.html',
  providers: [
    CustomersSearchService,
    { provide: INgxExcelDataSource, useExisting: CustomersSearchService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsCustomersSearchComponent extends BaseCustomersSearchComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
    this.context.subordinate = false;
  }

}
