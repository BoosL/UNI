import {Input, OnInit} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd';
import {NgxExcelModelColumnRules} from 'ngx-excel';
import {
  CustomersSearch,
  CustomersSearchService
} from '@uni/customer';

export abstract class BaseCustomersSearchComponent implements OnInit {
  rules: NgxExcelModelColumnRules<CustomersSearch>;

  @Input() context: CustomersSearch;

  constructor(
    protected modalRef: NzModalRef,
    protected dataService: CustomersSearchService
  ) {
  }

  ngOnInit() {
    this.rules = this.dataService.getRules();
    this.context = this.context || this.dataService.createModel();
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
