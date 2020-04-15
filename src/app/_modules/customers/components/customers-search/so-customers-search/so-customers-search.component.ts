import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { INgxExcelDataSource } from 'ngx-excel';
import { CustomersSearchService } from '@uni/customer';
import { BaseCustomersSearchComponent } from '../base-customers-search-component';

@Component({
  selector: 'so-customers-search.customers-search',
  templateUrl: './so-customers-search.component.html',
  providers: [
    CustomersSearchService,
    { provide: INgxExcelDataSource, useExisting: CustomersSearchService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoCustomersSearchComponent extends BaseCustomersSearchComponent implements OnInit { }
