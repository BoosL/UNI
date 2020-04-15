import {Component, ChangeDetectionStrategy, Input, ViewChild, AfterViewInit} from '@angular/core';
import {ProductSubject} from '@uni/core';
import {INgxExcelDataSource, NgxExcelComponent} from 'ngx-excel';
import {StudentContractRecordSubjectsDataService} from './student-contract-record-subjects-data.service';
@Component({
  selector: 'student-contract-record-subjects',
  templateUrl: './student-contract-record-subjects.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentContractRecordSubjectsDataService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentContractRecordSubjectsComponent implements AfterViewInit {
  @Input() subjects: ProductSubject[];
  @ViewChild(NgxExcelComponent, {static: false}) protected subjectExcelComponent: NgxExcelComponent;
  constructor(
    protected excel: StudentContractRecordSubjectsDataService,
  ) {
  }
  ngAfterViewInit(): void {
    this.excel.bindDataSet(this.subjects);
    this.subjectExcelComponent.reload();
  }
}
