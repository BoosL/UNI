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
import { Observable, Subscription, from } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { Student } from '@uni/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { StudentTeacherLog, StudentTeacherLogComment } from '../../../../models/student-teach-logs.model';
import { StudentTeachLogCommentsService } from '../../../../service/students/student-teach-log-comments.service';
import { StudentTeacheLogsService } from '../../../../service/students/student-teach-logs.service';

import { StudentTeachLogsEditComponent } from '../student-teach-log-edit/student-teach-log-edit.component';

@Component({
  selector: 'student-teach-log',
  templateUrl: './student-teach-log.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentTeacheLogsService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentTeachLogComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @Input() student$: Observable<Student>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected studentTeacheLogsService: StudentTeacheLogsService,
    protected drawer: NzDrawerService,
    protected studentTeachLogComment: StudentTeachLogCommentsService
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
      (studentId) => this.excelComponent.bindFilters({ studentId }).reload());
    this._componentSubscription.add(studentSubscription);
  }


  /**
   * 教学日志列表评论
   */
  // reviewTeachingLog = ({ context }: { context: StudentTeacherLog }) => {
  //   if (!this.student$) { return; }
  //   this.studentTeachLogComment.getList(
  //     { object_id: context.id, object_type: '4' }
  //   ).subscribe((result: StudentTeacherLogComment[]) => {
  //     const drawerRef = this.drawer.create({
  //       nzWidth: '45%',
  //       nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
  //       nzContent: StudentTeachLogsEditComponent,
  //       nzContentParams: {
  //         teacherLog: result,
  //       }
  //     });
  //   });
  // }

}
