import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import { EmployeeService, Employee } from '@uni/core';
import { Observable, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'employees',
  templateUrl: './employees.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: EmployeeService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() filters$: Observable<{ [name: string]: string | string[] }>;
  @ViewChild(NgxExcelComponent, { static: false }) protected excelComponent: NgxExcelComponent;

  // tslint:disable-next-line: variable-name
  private _componentSubscription = new Subscription();

  constructor(
    protected dataService: INgxExcelDataSource<Employee>
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (!this.filters$ || !this.excelComponent) { return; }
    this.excelComponent.bindMetas('organization_ids').subscribe((x) => console.log(x));
    this.filters$.subscribe((filters) => this.excelComponent.bindFilters(filters).reload());
  }

}
