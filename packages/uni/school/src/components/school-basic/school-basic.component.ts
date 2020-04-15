import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgxExcelModelColumnRules, INgxExcelDataSource, NgxExcelComponentService } from 'ngx-excel';
import { School, SchoolService } from '@uni/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'school-basic',
  templateUrl: './school-basic.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: SchoolService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolBasicComponent implements OnInit {

  rules: NgxExcelModelColumnRules<School>;

  @Input() school$: Observable<School>;

  constructor(
    protected schoolService: SchoolService
  ) { }

  ngOnInit() {
    this.rules = this.schoolService.getRules();
  }
}
