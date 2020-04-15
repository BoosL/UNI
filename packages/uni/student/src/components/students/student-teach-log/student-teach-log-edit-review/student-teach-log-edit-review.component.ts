import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { NgxExcelComponent, INgxExcelDataSource } from 'ngx-excel';
import { StudentTeacherLogComment } from '../../../../models/student-teach-logs.model';
import { StudentTeachLogReviewDataService } from './student-teach-log-review-data.service';


@Component({
  selector: 'student-teach-log-edit-review',
  templateUrl: './student-teach-log-edit-review.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentTeachLogReviewDataService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentTeachLogsEditReviewComponent implements OnInit, AfterViewInit {


  @Input() teacherLog: StudentTeacherLogComment[];
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: StudentTeachLogReviewDataService
  ) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.excel.bindDataSet(this.teacherLog);
    this.excelComponent.reload();
  }

}
