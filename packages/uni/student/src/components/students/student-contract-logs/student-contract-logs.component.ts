import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelModelColumnRules } from 'ngx-excel';
import { Observable, Subscription } from 'rxjs';
import { filter, distinctUntilChanged, delay } from 'rxjs/operators';
import {StudentContractLogsService} from '../../../service/students/student-contract-logs.service';
import {StudentContractLog} from '../../../models/student-contract-log';
import {StudentExt} from '../../../models/student-ext.model';

@Component({
  selector: 'student-contract-logs',
  templateUrl: './student-contract-logs.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentContractLogsService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentContractLogsComponent implements OnInit, OnDestroy, AfterViewInit {

  rules: NgxExcelModelColumnRules<StudentContractLog>
  // tslint:disable-next-line: variable-name
  private _componentSubscription = new Subscription();

  @Input() student$: Observable<StudentExt>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected studentContractLogsService: StudentContractLogsService
  ) { }

  ngOnInit() {
    this.rules = this.studentContractLogsService.getRules();
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const reloadSubscription = this.student$.pipe(
      filter((student) => !!student),
      distinctUntilChanged((o1, o2) => o1.id === o2.id),
      delay(200), // 为了等待前端刷新需要手动延迟 200ms
    ).subscribe(
      (student) => this.excelComponent.bindFilters({ studentId: student.id, schoolId: student.school.id }).reload()
    );
    this._componentSubscription.add(reloadSubscription);
  }

  calculateTimelineHeight = (context: StudentContractLog) => {
    switch (context.type.value) {
      case '3':
        // 换课
        return 290;
      case '1':
      case '2':
        // 新购/复购
        return 134;
      case '8':
        // 退课
        return 290;
      case '4':
        // 平移
        return 250;
      default:
        return 134;
    }
  }
}
