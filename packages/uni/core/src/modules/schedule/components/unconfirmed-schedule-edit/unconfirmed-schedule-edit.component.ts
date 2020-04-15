import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { INgxExcelDataSource, NgxExcelModelColumnRules } from 'ngx-excel';
import { NzDrawerRef } from 'ng-zorro-antd';
import { EmployeeScheduleService, EmployeeSchedule } from '../../../../logic/logic';

@Component({
  selector: 'unconfirmed-schedule-edit',
  templateUrl: './unconfirmed-schedule-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: EmployeeScheduleService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnconfirmedScheduleEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<EmployeeSchedule>;
  message: string;

  @Input() employeeSchedule: EmployeeSchedule;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<EmployeeSchedule[]>,
    protected employeeScheduleService: EmployeeScheduleService
  ) { }

  ngOnInit() {
    this.rules = this.employeeScheduleService.getRules();
    this.rules.type.selectOptions = [...this.employeeScheduleService.getUnconfirmedScheduleTypes()];
  }

  /**
   * 当点击确认时执行
   */
  confirm() {
    const availableScheduleTypes = this.employeeScheduleService.getUnconfirmedScheduleTypes();
    const isValid = this.employeeSchedule.type &&
      availableScheduleTypes.find((selectOption) => selectOption.value === this.employeeSchedule.type.value);
    if (isValid) {
      this.drawRef.close([this.employeeSchedule]);
    } else {
      this.message = '请选择班表类型';
      this.cdr.markForCheck();
    }
  }

  /**
   * 当窗口被关闭时执行
   */
  dismiss() {
    this.drawRef.close();
  }
}
