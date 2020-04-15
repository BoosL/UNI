import {
  Component,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import { Student, StudentBillService } from '@uni/core';
import { Observable, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'student-bills',
  templateUrl: './student-bills.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentBillService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentBillsComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @Input() student$: Observable<Student>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected studentBillService: StudentBillService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const studentSubscription = this.student$.pipe(
      filter((student) => !!student),
      map((student) => student.id),
      distinctUntilChanged()
    ).subscribe(
      (studentId) => this.excelComponent.bindFilters({ studentId }).reload()
    );
    this._componentSubscription.add(studentSubscription);
  }

}
