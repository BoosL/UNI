import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { TmkEmployeesSearchService } from '../../services/tmk-employees-search.service';
import { INgxExcelDataSource, NgxExcelModelColumnRules } from 'ngx-excel';
import { TmkEmployeesSearch } from '../../models/tmk-employees-search.model';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'tmk-employees-search',
  templateUrl: './tmk-employees-search.component.html',
  providers: [
    TmkEmployeesSearchService,
    { provide: INgxExcelDataSource, useExisting: TmkEmployeesSearchService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkEmployeesSearchComponent implements OnInit {

  rules: NgxExcelModelColumnRules<TmkEmployeesSearch>;

  @Input() context: TmkEmployeesSearch;

  constructor(
    protected modalRef: NzModalRef,
    protected dataSearch: TmkEmployeesSearchService
  ) { }

  ngOnInit() {
    this.rules = this.dataSearch.getRules();
    this.context = this.context || this.dataSearch.createModel();
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
