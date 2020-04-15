import {
  Component,
  ViewChild,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  INgxExcelDataSource,
  NgxExcelComponent,
} from 'ngx-excel';
import { Student } from '@uni/core';
import { Observable, Subscription } from 'rxjs';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';
import { StudentUseCurriculumsService } from '../../../service/students/student-use-curriculums.service';


@Component({
  selector: 'student-use-curriculums',
  templateUrl: './student-use-curriculums.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentUseCurriculumsService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentUseCurriculumComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @Input() student$: Observable<Student>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;



  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const studentUseCurriculums = this.student$.pipe(
      filter((student) => !!student),
      map((student) => student.id),
      distinctUntilChanged()
    ).subscribe((studentId) => {
      this.excelComponent.bindFilters({ studentId }).reload();
    });
    this._componentSubscription.add(studentUseCurriculums);
  }

}
