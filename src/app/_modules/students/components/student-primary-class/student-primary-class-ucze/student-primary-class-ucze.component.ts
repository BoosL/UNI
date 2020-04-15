import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelComponent,
} from 'ngx-excel';
import {Observable, Subscription} from 'rxjs';
import {StudentsPrimaryClass, StudentExt} from '@uni/student';
import {StudentPrimaryClassUczeDataService} from './student-primary-class-ucze-data.service';


@Component({
  selector: 'student-primary-class-ucze',
  templateUrl: './student-primary-class-ucze.component.html',
  providers: [
    StudentPrimaryClassUczeDataService,
    { provide: INgxExcelDataSource, useExisting: StudentPrimaryClassUczeDataService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentPrimaryClassUczeComponent implements AfterViewInit, OnDestroy {


  students: StudentExt[] = [];
  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  @Input() student$: Observable<StudentsPrimaryClass>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: StudentPrimaryClassUczeDataService
  ) {
  }

  ngAfterViewInit(): void {
    this._componentSubscription.add(this.student$.subscribe(
      (primaryClass) => {
        if (primaryClass && primaryClass.studentList && primaryClass.studentList.length > 0) {
          primaryClass.studentList.forEach( (item) => this.students.push(item));
          this.excelComponent.reload();
        }
      })
    );
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

}
