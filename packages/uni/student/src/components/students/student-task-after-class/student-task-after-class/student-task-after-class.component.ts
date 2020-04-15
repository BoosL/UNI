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
import { NzDrawerService } from 'ng-zorro-antd';
import { map, filter } from 'rxjs/operators';
import { StudentTaskAfterClass } from '../../../../models/student-task-after-class.model';
import { StudentTaskAfterClassService } from '../../../../service/students/student-task-after-class.service';
import { StudentTaskAfterClassEditComponent } from '../student-task-after-class-edit/student-task-after-class-edit.component';


@Component({
  selector: 'student-task-after-class',
  templateUrl: './student-task-after-class.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentTaskAfterClassService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentTaskAfterClassComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _relativeStudent: Student;

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
    const studentSubscription = this.student$.subscribe((student) => {
      if (!student) { return; }
      this._relativeStudent = student;
      const studentId = student.id;
      this.excelComponent.bindFilters(
        Object.assign({
          student_id: studentId,
        })
      ).reload();
    });
    this._componentSubscription.add(studentSubscription);
  }


  /**
   * 编辑学员课下任务
   */
  editTaskAfterClass = ({ context }: { context: StudentTaskAfterClass }) => {
    if (!this.student$) { return; }
    const drawerRef = this.drawer.create<StudentTaskAfterClassEditComponent, {
      studentTaskAfterClass: StudentTaskAfterClass,
      relativeStudentId: string,
    }, StudentTaskAfterClass>({
      nzWidth: '45%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentTaskAfterClassEditComponent,
      nzContentParams: {
        studentTaskAfterClass: context,
        relativeStudentId: this._relativeStudent.id,
      }
    });
    return drawerRef.afterClose.pipe(
      filter((studentTaskAfterClass) => !!studentTaskAfterClass),
      map((studentTaskAfterClass) => [{ action: 'append', contexts: studentTaskAfterClass }])
    );
  }

}
