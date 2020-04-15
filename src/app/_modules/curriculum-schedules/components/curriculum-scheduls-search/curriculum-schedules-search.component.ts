import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules} from 'ngx-excel';
import { NzModalRef } from 'ng-zorro-antd';
import {CurriculumSchedulesSearch} from '../../models/curriculum-schedules-search.model';
import {CurriculumSchedulesSearchService} from '../../_services/curriculum-schedules-search.service';

@Component({
  selector: 'curriculum-schedules-search.curriculum-schedules-search',
  templateUrl: './curriculum-schedules-search.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesSearchService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumSchedulesSearchComponent implements OnInit {
  rules: NgxExcelModelColumnRules<CurriculumSchedulesSearch>;
  @Input() context: CurriculumSchedulesSearch;
  constructor(
    protected modalRef: NzModalRef,
    protected curriculumSchedulesSearchService: CurriculumSchedulesSearchService
  ) {
  }
  ngOnInit() {
    this.rules = this.curriculumSchedulesSearchService.getRules();
    this.context = this.context || this.curriculumSchedulesSearchService.createModel() as CurriculumSchedulesSearch;
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
