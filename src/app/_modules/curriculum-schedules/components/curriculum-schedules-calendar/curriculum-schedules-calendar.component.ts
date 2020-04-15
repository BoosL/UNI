import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef, OnDestroy, AfterViewInit,
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {NzCalendarComponent} from 'ng-zorro-antd';
import {CurriculumScheduleModel} from '../../models/curriculum-schedule.model';
import {utc} from 'moment';
import {CurriculumSchedulesStateService} from '../../services/curriculum-schedules-state.service';
import {CurriculumSchedulesCalendarDataService} from '../../services/curriculum-schedules-calendar-data.service';

@Component({
  selector: 'curriculum-schedules-calendar',
  templateUrl: './curriculum-schedules-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CurriculumSchedulesCalendarDataService
  ]
})
export class CurriculumSchedulesCalendarComponent implements OnInit, OnDestroy, AfterViewInit {

  // 当前排课日期
  public selectCurrentDate: string;
  // 排课状态对应颜色
  public scheduleTypeColors = [];
  // tslint:disable: variable-name
  // 日期排课状态
  private _dateScheduleStatus: { [name: string]: string };
  private _componentSubscription = new Subscription();
  private _scheduleStatus: { [name: string]: string };
  @Input() scheduleDateSubject: Observable<string>;
  @Input() monthCurriculumSchedulesSubject: Observable<CurriculumScheduleModel[]>;
  @Output() handleCalendar = new EventEmitter<string>();
  @Output() handleCalendarComplete = new EventEmitter<string>();
  @ViewChild(NzCalendarComponent, { static: false }) protected nzCalendarComponent: NzCalendarComponent;

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected dataService: CurriculumSchedulesStateService,
    protected service: CurriculumSchedulesCalendarDataService
  ) {
  }

  ngOnInit() {
    this.scheduleTypeColors = this.dataService.getScheduleStatusColors();
  }

  ngAfterViewInit(): void {
    this._componentSubscription.add(this.monthCurriculumSchedulesSubject.pipe(
      distinctUntilChanged(),
      ).subscribe((res) => {
        this._setDateStatus(res);
      })
    );
    this._componentSubscription.add(this.scheduleDateSubject.subscribe((res) => {
        if (res) {
          this.selectCurrentDate = res;
          this.changeDetectorRef.detectChanges();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 点击日历
   * @param value 点击的具体日期
   */
  public onValueChange(value: Date): void {
    const date = utc(value).format('YYYY-MM-DD');
    if (date !== utc(this.selectCurrentDate).format('YYYY-MM-DD')) {
      this.handleCalendar.emit(utc(date).format('YYYY-MM-DD'));
    }
  }

  /**
   * 组装该月对应每天排课状态
   * @param res 月排课列表
   */
  private _setDateStatus(res: CurriculumScheduleModel[]) {
    this.service.getDateStatus(res).subscribe(
      (data) => {
        this._dateScheduleStatus = data.dateScheduleStatus;
        this._scheduleStatus = data.scheduleStatus;
        this.changeDetectorRef.markForCheck();
      }
    );
    this.handleCalendarComplete.emit();
  }

  /**
   * 上一个月
   */
  public handlePrevMonthClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const date = utc(this.selectCurrentDate).month(utc(this.selectCurrentDate).month() - 1).format('YYYY-MM-DD');
    this.handleCalendar.emit(date);

  }

  /**
   * 下一个月
   */
  public handleNextMonthClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const date = utc(this.selectCurrentDate).month(utc(this.selectCurrentDate).month() + 1).format('YYYY-MM-DD');
    this.handleCalendar.emit(date);
  }

  /**
   * 今天
   */
  public handleTodayClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const date = utc().local().format('YYYY-MM-DD');
    this.handleCalendar.emit(date);
  }

  /**
   * 获取当前排课日期
   */
  public getScheduleDate() {
    return this.selectCurrentDate ? utc(this.selectCurrentDate).local().format('MMM YYYY') : '';
  }

  /**
   * 设置颜色
   */
  public getColor(date) {
    const key = utc(date).local().format('YYYY-MM-DD');

    const index = this._scheduleStatus && this._scheduleStatus[key] ? this._scheduleStatus[key] : '';
    return index && index !== '5' ? this.scheduleTypeColors[parseFloat(index) - 1] : '';
  }
  /**
   * 获取背景
   */
  public getStatusClass(date) {
    const _date = utc(date).local().format('YYYY-MM-DD');
    return (this._dateScheduleStatus && this._dateScheduleStatus[_date]) ?  this._dateScheduleStatus[_date] : '';
  }

}
