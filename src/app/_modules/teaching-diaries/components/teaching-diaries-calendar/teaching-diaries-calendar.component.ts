import {
  Component,
  OnInit,
  ChangeDetectionStrategy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, AfterViewInit, OnDestroy,
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {NzCalendarComponent} from 'ng-zorro-antd';
import * as moment from 'moment';

@Component({
  selector: 'teaching-diaries-calendar',
  templateUrl: './teaching-diaries-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeachingDiariesCalendarComponent implements OnInit, AfterViewInit, OnDestroy {

  // 当前排课日期
  public selectCurrentDate: Date;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _scheduleStatus: { [name: string]: string };
  // 排课状态对应颜色
  private _scheduleTypeColors = [
    '#f5222d', // 有教务日志未填写
    '#15ab92', // 已填写
  ];

  @Input() selectCurrentDateSubject: Observable<string>;
  @Input() monthSchedulesSubject: Observable<any>;
  @Output() handleCalendar = new EventEmitter<string>();
  @ViewChild(NzCalendarComponent, { static: false }) protected nzCalendarComponent: NzCalendarComponent;

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this._componentSubscription.add(this.monthSchedulesSubject.subscribe((data: any) => {
        this._setDateSchedulesStatus(data);
      })
    );
    this._componentSubscription.add(this.selectCurrentDateSubject.subscribe((date: string) => {
        this.selectCurrentDate = new Date(date);
        this.changeDetectorRef.markForCheck();
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
    const date = moment(value).format('YYYY-MM-DD');
    if (date !== moment(this.selectCurrentDate).format('YYYY-MM-DD')) {
      this.handleCalendar.emit(date);
    }
  }

  /**
   * 组装对应每天排课状态
   * @param res 月排课列表
   */
  private _setDateSchedulesStatus(data: any) {
    this._scheduleStatus = {};
    for (const key of Object.keys(data)) {
      if (moment(key, 'YYYY-MM-DD', true).isValid()) {
        this._scheduleStatus[key] = '1';
        const obj = data[key];
        if (obj) {
          for (const item of obj) {
            if (item.teachingUpdate) {
              this._scheduleStatus[key] = item.teachingInsert ? '1' : '0';
              break;
            }
          }
        }
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  /**
   * 上一个月
   */
  public handlePrevMonthClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const date = moment(this.selectCurrentDate).month(moment(this.selectCurrentDate).month() - 1).format('YYYY-MM-DD');
    this.handleCalendar.emit(date);

  }

  /**
   * 下一个月
   */
  public handleNextMonthClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const date = moment(this.selectCurrentDate).month(moment(this.selectCurrentDate).month() + 1).format('YYYY-MM-DD');
    this.handleCalendar.emit(date);
  }

  /**
   * 今天
   */
  public handleTodayClick(e) {
    e.stopPropagation();
    e.preventDefault();
    const date = moment().local().format('YYYY-MM-DD');
    this.handleCalendar.emit(date);
  }

  /**
   * 获取当前排课日期
   */
  public getScheduleDate() {
    return this.selectCurrentDate ? moment(this.selectCurrentDate).format('MMM YYYY') : '';
  }

  /**
   * 设置颜色
   */
  public getColor(date) {
    const _date = moment(date).format('YYYY-MM-DD');
    let color = this._scheduleStatus && this._scheduleStatus[_date] ? this._scheduleTypeColors[this._scheduleStatus[_date]] : '';
    const days = moment(_date).diff(moment().local(), 'day');
    // 历史数据才可以签课
    if (days > -1) {
      color = '';
    }
    return color;
  }
}
