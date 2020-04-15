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
import { NzDrawerService, NzModalService } from 'ng-zorro-antd';
import { StudentCcFollows, StudentFollows } from '../../../../../models/student-follows.model';
import { StudentFollowsService } from '../../../../../service/students/student-follows.service';
import { StudentCcFollowEditComponent } from '../student-cc-follow-edit/student-cc-follow-edit.component';
import { StudentCcFollowsRecordsCheckComponent } from '../students-cc-follows-records-check/students-cc-follows-records-check.component';


@Component({
  selector: 'student-cc-follows',
  templateUrl: './student-cc-follows.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentFollowsService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentCcFollowsComponent implements OnInit, AfterViewInit, OnDestroy {


  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _studentId: string;

  @Input() student$: Observable<Student>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected drawer: NzDrawerService,
    protected modal: NzModalService,
    protected studentFollowsService: StudentFollowsService
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
            follow_type: 2
          })
        ).reload();
        this._studentId = studentId;
      }
    );
    this._componentSubscription.add(studentSubscription);
  }




  /**
   * 添加学员CC跟进记录
   */
  editCcFollows = () => {
    if (!this.student$) { return; }
    const drawerRef = this.drawer.create<StudentCcFollowEditComponent, {
      relativeStudentId: string,
    }, StudentCcFollows>({
      nzWidth: '30%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentCcFollowEditComponent,
      nzContentParams: {
        relativeStudentId: this._studentId,
      }
    });
    return drawerRef.afterClose.pipe(
      filter((studentTaskAfterClass) => !!studentTaskAfterClass),
      map((studentTaskAfterClass) => [{ action: 'append', contexts: studentTaskAfterClass }])
    );
  }

  /**
   * 查看学员CC跟进录音
   */
  handleRecordingClick = (e: StudentFollows) => {
    console.log(e);
    this.modal.create({
      nzWidth: '600',
      nzBodyStyle: { padding: '0' },
      nzContent: StudentCcFollowsRecordsCheckComponent,
      nzComponentParams: { context: e }
    }).afterClose.subscribe((searchConditions) => {
      // 返回 undefined 代表直接关闭
      if (searchConditions === undefined) {
        return;
      }
    });
  }

}
