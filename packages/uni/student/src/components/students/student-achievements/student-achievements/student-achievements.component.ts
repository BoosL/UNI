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
import { Observable, Subscription, from } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { StudentAchievements } from '../../../../models/student-achievements.model';
import { StudentAchievementsService } from '../../../../service/students/student-achevements.service';
import { StudentAchievementCheckComponent } from '../student-achievement-check/student-achievement-check.component';
import { StudentAchievementEditComponent } from '../student-achievement-edit/student-achievement-edit.component';


@Component({
  selector: 'student-achievements',
  templateUrl: './student-achievements.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentAchievementsService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentAchievementsComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _studentId: string;

  @Input() student$: Observable<Student>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected drawer: NzDrawerService,
    protected studentAchievementsService: StudentAchievementsService,
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
      },
    );
    this._componentSubscription.add(studentSubscription);
  }

  /**
   * 查看学员成绩
   */
  checkStudentScores = ({ context }: { context: StudentAchievements }) => {
    if (!this.student$) { return; }
    this.studentAchievementsService.getModel(
      context.id,
      { studentId: this._studentId }
    ).subscribe((result: StudentAchievements) => {
      const drawerRef = this.drawer.create({
        nzWidth: '36%',
        nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
        nzContent: StudentAchievementCheckComponent,
        nzContentParams: {
          achievement: result,
        }
      });
    });
  }


  /**
   * 添加学员成绩
   */
  addStudentScores = ({ context }: { context: StudentAchievements }) => {
    if (!this.student$) { return; }
    const drawerRef = this.drawer.create<StudentAchievementEditComponent, {
      studentId: string,
    }, StudentAchievements>({
      nzWidth: '36%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentAchievementEditComponent,
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
