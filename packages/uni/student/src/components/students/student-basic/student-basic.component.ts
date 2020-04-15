import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  NgxExcelModelColumnRules,
  INgxExcelDataSource,
  NgxExcelComponentService,
  NgxExcelComponent
} from 'ngx-excel';
import { SchoolMenuService } from '@uni/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { NzModalService, NzDrawerService } from 'ng-zorro-antd';
import { StudentExt } from '../../../models/student-ext.model';
import { StudentExtService } from '../../../service/students/student-ext.service';
import { StudentBasicComponentService } from './student-basic-component.service';
import { StudentChangeSchoolEditComponent } from '../student-change-school-edit/student-change-school-edit.component';
import { StudentTransferSchool } from '../../../models/models';


@Component({
  selector: 'student-basic',
  templateUrl: './student-basic.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentExtService },
    { provide: NgxExcelComponentService, useClass: StudentBasicComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentBasicComponent implements OnInit {

  rules: NgxExcelModelColumnRules<StudentExt>;
  transformedStudent$: Observable<StudentExt>;
  studentId: string;

  @Input() student$: Observable<StudentExt>;
  @Output() studentChange = new EventEmitter<StudentExt>();

  @ViewChild(NgxExcelComponent, { static: false }) private excelComponent: NgxExcelComponent;

  constructor(
    protected schoolMenuService: SchoolMenuService,
    protected studentExtService: StudentExtService,
    protected modal: NzModalService,
    protected drawer: NzDrawerService,
  ) { }

  ngOnInit() {
    this.rules = this.studentExtService.getRules();
    this.transformedStudent$ = this.student$.pipe(
      map((student) => {
        const currentSchool = this.schoolMenuService.currentSchool;
        this.studentId = student.id;
        if (!currentSchool) {
          throw new Error('系统错误，请联系管理员');
        }
        return Object.assign(student, { schoolId: currentSchool.id }) as StudentExt;
      })
    );
  }

  /**
   * 发出学员信息变更事件
   * @param student 变更后的学员信息
   */
  handleContextChange(student: StudentExt) {
    this.studentChange.emit(student);
  }


  /**
   * 转校申请
   */
  handleChangeButtonClick(e: any) {
    if (!this.student$) { return; }
    const drawerRef = this.drawer.create<StudentChangeSchoolEditComponent, {
      studentId: string,
      school: string
    }, StudentTransferSchool>({
      nzWidth: '48%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: StudentChangeSchoolEditComponent,
      nzContentParams: {
        studentId: this.studentId,
        school: this.schoolMenuService.currentSchool.name
      },
    });
    return drawerRef.afterClose.pipe(
      filter((studentChangeSchool) => !!studentChangeSchool),
      map((studentChangeSchool) => [{ action: 'append', contexts: studentChangeSchool }])
    );
  }
}
