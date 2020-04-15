import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgxExcelComponentService, INgxExcelDataSource, NgxExcelComponent, NgxExcelDataService } from 'ngx-excel';
import { Employee, EmployeeOrganizationPosition } from '../../../../logic/logic';
import { EmployeeRelativeOPDataSource } from '../../services/employee-relative-o-p-data.service';
import { EmployeeRelativeOPComponentService } from '../../services/employee-relative-o-p-component.service';

@Component({
  selector: 'employee-relative-o-p',
  templateUrl: './employee-relative-o-p.component.html',
  providers: [
    { provide: INgxExcelDataSource, useClass: EmployeeRelativeOPDataSource },
    { provide: NgxExcelComponentService, useClass: EmployeeRelativeOPComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeRelativeOPComponent implements OnInit, AfterViewInit, OnDestroy {

  private _componentSubscription = new Subscription();

  @Input() employee$: Observable<Employee>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected dataService: INgxExcelDataSource<EmployeeOrganizationPosition>
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    const employeeSubscription = this.employee$.subscribe(
      (employee) => {
        if (!employee) { return; }
        this._getService().bindDataSet(employee.relativeOrganizationPosition);
        this.excelComponent.reload();
      }
    );
    this._componentSubscription.add(employeeSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 强制声明数据源对象
   */
  private _getService(): NgxExcelDataService<EmployeeOrganizationPosition> {
    return this.dataService as NgxExcelDataService<EmployeeOrganizationPosition>;
  }

}
