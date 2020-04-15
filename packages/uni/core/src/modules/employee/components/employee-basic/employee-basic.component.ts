import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, EmployeeService } from '../../../../logic/logic';
import {
  NgxExcelModelColumnRules,
  NgxExcelComponentService,
  NgxExcelColumnType,
  INgxExcelDataSource
} from 'ngx-excel';
import { EmployeeBasicComponentService } from '../../services/employee-basic-component.service';

interface EmployeeBasic extends Employee {
  position: string;
  level: string;
}

@Component({
  selector: 'employee-basic',
  templateUrl: './employee-basic.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: EmployeeService },
    { provide: NgxExcelComponentService, useClass: EmployeeBasicComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeBasicComponent implements OnInit {

  rules: NgxExcelModelColumnRules<EmployeeBasic>;

  @Input() employee$: Observable<Employee>;
  @Output() employeeChange = new EventEmitter<Employee>();

  handlePasswordClick = (employee: Employee) => console.log(employee);

  constructor(
    public employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.rules = this.employeeService.getRules() as NgxExcelModelColumnRules<EmployeeBasic>;
    this.rules.position = { label: '当前职位', columnType: NgxExcelColumnType.Text };
    this.rules.level = { label: '职称等级', columnType: NgxExcelColumnType.Text };
  }

  /**
   * 发出员工信息变更事件
   * @param employee 变更后的员工信息
   */
  handleEmployeeChange(employee: Employee) {
    this.employeeChange.emit(employee);
  }
}
