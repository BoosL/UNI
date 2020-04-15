import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelModelColumnRules } from 'ngx-excel';
import { StudentsSearchService } from '../../services/students-search.service';
import { StudentSearch } from '../../models/student-search.model';




@Component({
  selector: 'students-search',
  templateUrl: './students-search.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentsSearchService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentsSearchComponent implements OnInit {

  rules: NgxExcelModelColumnRules<StudentSearch>;

  @Input() context: StudentSearch;


  constructor(
    protected modalRef: NzModalRef,
    protected studentsSearchService: StudentsSearchService,
  ) { }

  ngOnInit() {
    this.rules = this.studentsSearchService.getRules();
    this.context = this.context || this.studentsSearchService.createModel() as StudentSearch;
    this.rules.firstContractedAt.label = '入学时间';
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

