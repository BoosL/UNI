import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules } from 'ngx-excel';
import { EmployeeSchedule, EmployeeScheduleService } from '../../../../logic/logic';
import { ConfirmedScheduleEditDataService } from '../../services/confirmed-schedule-edit-data.service';
import { ConfirmedScheduleEditComponentService } from '../../services/confirmed-schedule-edit-component.service';
import { ConfirmedScheduleEditModel } from '../../models/confirmed-schedule-edit.model';

@Component({
  selector: 'confirmed-schedule-edit',
  templateUrl: './confirmed-schedule-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: ConfirmedScheduleEditDataService },
    { provide: NgxExcelComponentService, useClass: ConfirmedScheduleEditComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmedScheduleEditComponent implements OnInit {

  editModel: ConfirmedScheduleEditModel;
  rules: NgxExcelModelColumnRules<ConfirmedScheduleEditModel>;
  message: string;
  loading = false;

  @Input() employeeSchedule: EmployeeSchedule;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawerRef: NzDrawerRef<EmployeeSchedule[]>,
    protected dataService: ConfirmedScheduleEditDataService,
    protected employeeScheduleService: EmployeeScheduleService
  ) { }

  ngOnInit() {
    this.rules = this.dataService.getRules();
    this.editModel = this.dataService.createModel({
      originalDate: this.employeeSchedule ? this.employeeSchedule.date : '',
      originalScheduleType: this.employeeSchedule ? this.employeeSchedule.type : null,
      startDate: this.employeeSchedule ? this.employeeSchedule.date : '',
      endDate: this.employeeSchedule ? this.employeeSchedule.date : ''
    });
  }

  /**
   * 当确认按钮被点击时执行
   */
  confirm() {
    const payload = {
      type: this.editModel ? this.editModel.scheduleType : null,
      startDate: this.editModel ? this.editModel.startDate : '',
      endDate: this.editModel ? this.editModel.endDate : '',
      attachments: this.editModel ? this.editModel.attachments : [],
      remark: this.editModel ? this.editModel.remark : '',
      employeeId: '_current'
    };
    if (this.editModel.scheduleType.value === '5') {
      // tslint:disable-next-line: no-string-literal
      payload['converseRestDates'] = this.editModel.restDates.map((restDate) => restDate.date);
    }

    this.loading = true;
    this.cdr.markForCheck();
    this.employeeScheduleService.batchUpdate(payload).subscribe((employeeSchedules) => {
      this.loading = false;
      this.drawerRef.close(employeeSchedules);
    }, (e) => {
      this.loading = false;
      this.message = e.message || '系统错误，请联系管理员';
      this.cdr.markForCheck();
    });
  }

  /**
   * 当关闭按钮被点击时执行
   */
  dismiss() {
    this.drawerRef.close();
  }

}
