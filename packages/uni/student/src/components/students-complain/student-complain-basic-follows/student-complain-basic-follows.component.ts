import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  Input,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import {
  INgxExcelDataSource, NgxExcelComponent
} from 'ngx-excel';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { NzDrawerService } from 'ng-zorro-antd';
import { StudentComplain } from '../../../models/student-complain.model';
import { StudentComplainFollowsService } from '../../../service/students-complain/students-complain-follows.service';
// tslint:disable: max-line-length
import { StudentComplainBasicFollowEditComponent } from '../student-complain-basic-follow-edit/student-complain-basic-follow-edit.component';


@Component({
  selector: 'student-complain-basic-follows',
  templateUrl: './student-complain-basic-follows.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentComplainFollowsService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentComplainBasicFollowsComponent implements OnInit, AfterViewInit, OnDestroy {

  studentId: string;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();


  @Input() student$: Observable<StudentComplain>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected drawer: NzDrawerService,
    protected studentComplainFollowsService: StudentComplainFollowsService,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    const studentSubscription = this.student$.pipe(
      filter((student) => !!student),
      map((student) => student.id),
      distinctUntilChanged()
    ).subscribe(
      (studentId) => {
        this.excelComponent.bindFilters({ studentId }).reload();
        this.studentId = studentId;
      }
    );
    this._componentSubscription.add(studentSubscription);
  }


  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }


 appendComplaintsFollowup = () => {
    const drawerRef = this.drawer.create<StudentComplainBasicFollowEditComponent, {
      studentId: string,
    }, StudentComplain>({
      nzWidth: '45%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentComplainBasicFollowEditComponent,
      nzContentParams: {
        studentId: this.studentId,
      }
    });
    return drawerRef.afterClose.pipe(
      filter((studentsComplain) => !!studentsComplain),
      map((studentsComplain) => [{ action: 'append', contexts: studentsComplain }])
    );
  }
}
