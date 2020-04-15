import {
  Component,
  ChangeDetectionStrategy, ViewChild, AfterViewInit, Input, Renderer2, OnDestroy, Output, EventEmitter
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {INgxExcelDataSource, NgxExcelComponent} from 'ngx-excel';
import {CurriculumScheduleModel, RelativeEntity} from '../../models/curriculum-schedule.model';
import {CurriculumSchedulesListDataService} from '../../services/curriculum-schedules-list-data.service';

@Component({
  selector: '.curriculum-schedules-list',
  templateUrl: './curriculum-schedules-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesListDataService,
    { provide: INgxExcelDataSource, useExisting: CurriculumSchedulesListDataService }
  ]
})
export class CurriculumSchedulesListComponent implements AfterViewInit, OnDestroy {
  public cellHeight = 60;
  // tslint:disable: variable-name
  protected _componentSubscription = new Subscription();
  @Input() monthCurriculumSchedulesSubject: Observable<CurriculumScheduleModel[]>;
  @Output() handleLoadingStatus = new EventEmitter<any>();
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor(
    protected excel: CurriculumSchedulesListDataService,
    protected renderer2: Renderer2,
  ) {
  }

  ngAfterViewInit() {
    this._componentSubscription.add(this.monthCurriculumSchedulesSubject.pipe(
      distinctUntilChanged()
      ).subscribe((schedules: CurriculumScheduleModel[]) => {
        this.excel.bindDataSet(schedules);
        this.excelComponent.reload();
        this.handleLoadingStatus.emit();
      })
    );
  }

  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 获取实体名单
   */
  public getEntries(data: RelativeEntity[]) {
    const list = [];
    if (data && data.length > 0) {
      for (const item of data) {
        if (item.student) {
          list.push(item.student.name);
        }
        if (item.customer) {
          list.push(item.customer.name);
        }
      }
    }
    return list.join('，');
  }
}
