import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponent, NgxExcelComponentService } from 'ngx-excel';
import { School } from '@uni/core';
import { SchoolRestTimeService } from '../../_services/school-rest-time.service';
import { SchoolRestTime } from '../../models/school.model';
import { Observable, Subscription } from 'rxjs';
import { SchoolRestTimeComponentService } from '../../services/school-rest-time-component.service';
import { SchoolRestTimeEditComponent } from '../school-rest-time-edit/school-rest-time-edit.component';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'school-rest-time',
  templateUrl: './school-rest-time.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: SchoolRestTimeService },
    { provide: NgxExcelComponentService, useClass: SchoolRestTimeComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolRestTimeComponent implements OnInit, AfterViewInit, OnDestroy {

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _relativeSchool: School;

  @Input() school$: Observable<School>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  appendSchoolRestTime = () => {
    if (!this._relativeSchool) { return; }

    const drawerRef = this.drawer.create<SchoolRestTimeEditComponent, {
      schoolRestTime: SchoolRestTime,
      relativeSchool: School
    }, SchoolRestTime>({
      nzWidth: 360,
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: SchoolRestTimeEditComponent,
      nzContentParams: { schoolRestTime: null, relativeSchool: this._relativeSchool }
    });

    return drawerRef.afterClose.pipe(
      filter((schoolRestTime) => !!schoolRestTime),
      map((schoolRestTime) => [{ action: 'append', context: schoolRestTime }])
    );
  }

  constructor(
    protected drawer: NzDrawerService
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    const schoolSubscription = this.school$.subscribe((school) => {
      if (!school) { return; }
      this._relativeSchool = school;
      this.excelComponent.bindFilters({ schoolId: this._relativeSchool.id }).reload();
    });
    this._componentSubscription.add(schoolSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

}
