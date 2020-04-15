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
  NgxExcelComponentService
} from 'ngx-excel';
import { School } from '@uni/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { StudentExt } from '../../../../models/student-ext.model';
import { StudentSchedule } from '../../../../models/student-schedule.model';
import { StudentScheduleService } from '../../../../service/students/student-schedule.service';
import { StudentScheduleComponentService } from './student-schedule-component.service';
import { StudentScheduleEditComponent } from '../student-schedule-edit/student-schedule-edit.component';


@Component({
  selector: 'student-schedules',
  templateUrl: './student-schedules.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentScheduleService },
    { provide: NgxExcelComponentService, useClass: StudentScheduleComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentSchedulesComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _relativeStudent: StudentExt;
  private _relativeSchool: School;

  @Input() student$: Observable<StudentExt>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;


  constructor(
    protected drawer: NzDrawerService,
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const studentSubscription = this.student$.subscribe((student) => {
      if (!student) { return; }
      this._relativeStudent = student;
      this._relativeSchool = student.school;
      const schoolId = student.school.id;
      const studentId = student.id;
      this.excelComponent.bindFilters(
        Object.assign({
          campus_id: schoolId,
          student_id: studentId,
          load_collection: true
        })
      ).reload();
    });
    this._componentSubscription.add(studentSubscription);
  }


  /**
   * 新增上课频率
   */
  appendSchedules = () => {
    if (!this._relativeStudent) { return; }
    const drawerRef = this.drawer.create<StudentScheduleEditComponent, {
      relativeStudent: StudentExt,
      relativeSchool: School
    }, StudentSchedule[]>({
      nzWidth: '30%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentScheduleEditComponent,
      nzContentParams: {
        relativeStudent: this._relativeStudent,
        relativeSchool: this._relativeSchool
      }
    });
    return drawerRef.afterClose.pipe(
      filter((studentSchedules) => studentSchedules.length > 0),
      map((studentSchedules) => [{ action: 'append', contexts: studentSchedules }])
    );
  }



}
