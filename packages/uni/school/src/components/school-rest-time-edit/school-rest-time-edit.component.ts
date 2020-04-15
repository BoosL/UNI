import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { NgxExcelModelColumnRules, INgxExcelDataSource, NgxExcelComponentService } from 'ngx-excel';
import { School } from '@uni/core';
import { SchoolRestTimeService } from '../../_services/school-rest-time.service';
import { SchoolRestTime } from '../../models/school.model';
import { SchoolRestTimeComponentService } from '../../services/school-rest-time-component.service';
import { of } from 'rxjs';
import { tap, delay, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'school-rest-time-edit',
  templateUrl: './school-rest-time-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: SchoolRestTimeService },
    { provide: NgxExcelComponentService, useClass: SchoolRestTimeComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolRestTimeEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<SchoolRestTime>;
  loading = false;
  message = '';

  @Input() schoolRestTime: SchoolRestTime;
  @Input() relativeSchool: School;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<SchoolRestTime>,
    protected schoolRestTimeService: SchoolRestTimeService
  ) { }

  ngOnInit() {
    this.schoolRestTime = this.schoolRestTime || this.schoolRestTimeService.createModel({ relativeSchool: this.relativeSchool });
    this.rules = this.schoolRestTimeService.getRules();
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      mergeMap(() => this.schoolRestTimeService.save(
        Object.assign({}, this.schoolRestTime, { schoolId: this.relativeSchool.id }),
        this.schoolRestTime.id
      ))
    ).subscribe(
      (schoolRestTime) => this.drawRef.close(schoolRestTime),
      ({ message }) => {
        this.loading = false;
        this.message = message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  dismiss(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.drawRef.close();
  }

}
