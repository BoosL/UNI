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
import { NzDrawerService } from 'ng-zorro-antd';
import { Student } from '@uni/core';
import { Observable, Subscription } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { StudentFeedback } from '../../../../models/student-feedbacks.model';
import { StudentFeedBackService } from '../../../../service/students/student-feedbacks.service';
import { StudentFeedbackCheckComponent } from '../student-feedback-check/student-feedback-check.component';
import { StudentFeedbackEditComponent } from '../student-feedback-edit/student-feedback-edit.component';


@Component({
  selector: 'student-feedbacks',
  templateUrl: './student-feedbacks.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentFeedBackService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentFeedBacksComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _studentId: string;
  private _componentSubscription = new Subscription();

  @Input() student$: Observable<Student>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected drawer: NzDrawerService,
    protected studentFeedBackService: StudentFeedBackService
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
        this.excelComponent.bindFilters({ studentId }).reload();
        this._studentId = studentId;
      }
    );
    this._componentSubscription.add(studentSubscription);
  }


  /**
   * 查看学员反馈
   */
  feedbackReview = ({ context }: { context: StudentFeedback }) => {
    if (!this.student$) { return; }
    this.studentFeedBackService.getModel(
      context.id,
      { studentId: this._studentId }
    ).subscribe((result: StudentFeedback) => {
      const drawerRef = this.drawer.create({
        nzWidth: '45%',
        nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
        nzContent: StudentFeedbackCheckComponent,
        nzContentParams: {
          feedback: result,
        }
      });
    });
  }

  /**
   * 新增学员反馈
   */
  addFeedback = ({ context }: { context: StudentFeedback }) => {
    if (!this.student$) { return; }
    const drawerRef = this.drawer.create<StudentFeedbackEditComponent, {
      studentId: string,
    }, StudentFeedback>({
      nzWidth: '30%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentFeedbackEditComponent,
      nzContentParams: {
        studentId: this._studentId,
      },
    });
    return drawerRef.afterClose.pipe(
      filter((studentAchievement) => !!studentAchievement),
      map((studentAchievement) => [{ action: 'append', contexts: studentAchievement }])
    );
  }

}
