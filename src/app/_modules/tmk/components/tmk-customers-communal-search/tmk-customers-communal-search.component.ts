import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import {INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules} from 'ngx-excel';
import { CustomersSearchService } from '@uni/customer';
import {TmkCustomersCommunalSearchComponentService} from './tmk-customers-communal-search-component.service';
import {TmkCustomersSearchService} from '../../services/tmk-customers-search.service';
import {TmkCustomersSearch} from '../../models/tmk-customers-search.model';


@Component({
  selector: ' tmk-customers-communal-search',
  templateUrl: './tmk-customers-communal-search.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: TmkCustomersSearchService },
    { provide: NgxExcelComponentService, useClass: TmkCustomersCommunalSearchComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomersCommunalSearchComponent implements OnInit {

  rules: NgxExcelModelColumnRules<TmkCustomersSearch>;
  componentValue: TmkCustomersSearch;

  @Input() context: TmkCustomersSearch;


  constructor(
    protected message: NzMessageService,
    protected modalRef: NzModalRef,
    protected tmkCustomerService: TmkCustomersSearchService,
    protected customersSearchService: CustomersSearchService
  ) { }

  ngOnInit() {
    this.rules = this.tmkCustomerService.getRules();
    this.context = this.context || this.tmkCustomerService.createModel() as TmkCustomersSearch;
    this.rules.relativeThirdSource.label = '定位(三级渠道)';
  }


  reset(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close(null);
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => this.modalRef.close(this.context), 200);
  }



}

