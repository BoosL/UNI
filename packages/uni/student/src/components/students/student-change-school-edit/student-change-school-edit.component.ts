import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { of } from 'rxjs';
import { delay, map, mergeMap, tap } from 'rxjs/operators';
import { StudentTransferSchool } from '../../../models/student-transfer-school.model';
import { StudentChangeSchoolEditService } from '../../../service/students/student-transfer-school-edit.service';



@Component({
  selector: 'student-change-school-edit',
  templateUrl: './student-change-school-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentChangeSchoolEditService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class StudentChangeSchoolEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<StudentTransferSchool>;
  loading = false;
  message = '';
  context: StudentTransferSchool;

  @Input() studentId: string;
  @Input() school: string;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<StudentTransferSchool[]>,
    protected studentChangeSchoolEditService: StudentChangeSchoolEditService
  ) { }

  ngOnInit() {
    this.rules = this.studentChangeSchoolEditService.getRules();
    this.context = this.studentChangeSchoolEditService.createModel();
    this.context.campus = this.school;
  }


  /**
   * 当表单提交时执行
   */
  confirm() {
    of(null).pipe(
      delay(200),
      map(() => ({
        old_campus: this.context.campus,
        new_campus: this.context.intoCmpus,
        is_arrears: this.context.expiredProduct,
        is_expired: this.context.balance,
        ding_number: this.context.number,
        remark: this.context.remark,
        // diff_amount: this.context.totalPoints,
        // old_contract_amount: this.context.totalPoints,
        // new_contract_amount: this.context.totalPoints,
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.studentChangeSchoolEditService.batchSave(
        Object.assign(payload, { studentId: this.studentId })
      ))
    ).subscribe(
      (studentTransferSchool) => this.drawRef.close(studentTransferSchool),
      (e) => {
        this.loading = false;
        this.message = e.message || '系统错误,请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  dismiss() {
    this.drawRef.close();
  }

}
