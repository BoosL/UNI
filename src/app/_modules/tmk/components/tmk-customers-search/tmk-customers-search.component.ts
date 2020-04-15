import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules} from 'ngx-excel';
import { NzModalRef } from 'ng-zorro-antd';
import { TmkCustomersSearchService } from '../../services/tmk-customers-search.service';
import { TmkCustomersSearch } from '../../models/tmk-customers-search.model';
import {TmkCustomersSearchComponentService} from './tmk-customers-search-component.service';
@Component({
  selector: 'tmk-customers-search.tmk-customers-search',
  templateUrl: './tmk-customers-search.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: TmkCustomersSearchService },
    { provide: NgxExcelComponentService, useClass: TmkCustomersSearchComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomersSearchComponent implements OnInit {
  rules: NgxExcelModelColumnRules<TmkCustomersSearch>;
  @Input() context: TmkCustomersSearch;
  constructor(
    protected modalRef: NzModalRef,
    protected customersSearchService: TmkCustomersSearchService
  ) {
  }
  ngOnInit() {
    this.rules = this.customersSearchService.getRules();
    this.context = this.context || this.customersSearchService.createModel() as TmkCustomersSearch;
    this.context.subordinate = true;
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
