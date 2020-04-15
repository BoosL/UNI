import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Employee, EmployeeService } from '../../../../logic/logic';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'employee',
  templateUrl: './employee.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeComponent implements OnInit {

  employee$ = new BehaviorSubject<Employee>(null);

  @Input() employeeIdStream: Observable<string>;

  constructor(
    protected message: NzMessageService,
    protected employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.employeeIdStream.pipe(
      mergeMap((employeeId) => this.employeeService.getModel(employeeId))
    ).subscribe(
      (employee) => this.employee$.next(employee),
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
  }

  /**
   * 当员工信息发生变化时需要通知其他组件
   * @param employee 变化后的员工信息
   */
  handleEmployeeChange(employee: Employee) {
    this.employee$.next(employee);
  }

}
