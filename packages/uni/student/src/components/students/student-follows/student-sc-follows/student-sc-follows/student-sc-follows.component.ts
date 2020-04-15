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
import { Student } from '@uni/core';
import { Observable, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { NzDrawerService } from 'ng-zorro-antd';
import { StudentScFollows } from '../../../../../models/student-follows.model';
import { StudentFollowsService } from '../../../../../service/students/student-follows.service';
import { StudentScFollowsEditComponent } from '../student-sc-follow-edit/student-sc-follow-edit.component';



@Component({
  selector: 'student-sc-follows',
  templateUrl: './student-sc-follows.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentFollowsService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentScFollowsComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _studentId: string;

  @Input() student$: Observable<Student>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected drawer: NzDrawerService,
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
      (studentId) => {
        this.excelComponent.bindFilters(
          Object.assign({
            student_id: studentId,
            follow_type: 5
          })
        ).reload();
        this._studentId = studentId;
      },
    );
    this._componentSubscription.add(studentSubscription);
  }



  /**
   * 添加学员SC跟进记录
   */
  editScFollows = ({ context }: { context: StudentScFollows }) => {
    if (!this.student$) { return; }
    const drawerRef = this.drawer.create<StudentScFollowsEditComponent, {
      studentFollows: StudentScFollows,
      relativeStudentId: string,
    }, StudentScFollows>({
      nzWidth: '45%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentScFollowsEditComponent,
      nzContentParams: {
        studentFollows: context,
        relativeStudentId: this._studentId,
      }
    });
    return drawerRef.afterClose.pipe(
      filter((studentTaskAfterClass) => !!studentTaskAfterClass),
      map((studentTaskAfterClass) => [{ action: 'append', contexts: studentTaskAfterClass }])
    );
  }

}
