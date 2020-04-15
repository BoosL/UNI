import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';
import { NzMessageService, NzDrawerService, NzDrawerRef } from 'ng-zorro-antd';
import { AuthService } from '@uni/common';
import { EmployeeSchedule, EmployeeScheduleService, EmployeeService } from '../../../../logic/logic';
import { SelectOption } from '../../../../models/models';
import { BACKEND_PAGE, IBackendPageComponent } from '../../../shared/components/page/interfaces/page.component';
import { BehaviorSubject } from 'rxjs';
import { mergeMap, map, tap, distinctUntilChanged } from 'rxjs/operators';
import { utc, Moment } from 'moment';
import { UnconfirmedScheduleEditComponent } from '../unconfirmed-schedule-edit/unconfirmed-schedule-edit.component';
import { ConfirmedScheduleEditComponent } from '../confirmed-schedule-edit/confirmed-schedule-edit.component';

export interface ScheduleType extends SelectOption {
  color: string;
  disabled: boolean;
}

export type ScheduleStatus = 'Unconfirmed' | 'Confirming' | 'Confirmed';

@Component({
  selector: 'backend-page.schedule',
  templateUrl: './schedule.component.html',
  animations: [
    trigger('scale', [
      state('smaller', style({ transform: 'scale(0)' })),
      state('bigger', style({ transform: 'scale(8)' })),
      transition('smaller <=> bigger', animate('200ms ease'))
    ])
  ],
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => ScheduleComponent) }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent extends IBackendPageComponent implements OnInit {

  currentDate: Moment = null;
  selectedDate: Date = utc().toDate();
  currentMonthScaleState = '';
  currentMonthScaleValue = '';
  scheduleTypes$ = new BehaviorSubject<ScheduleType[]>([]);
  scheduleStatus: ScheduleStatus;
  scheduleData: { [date: string]: EmployeeSchedule } = {};
  loading = false;

  // tslint:disable: variable-name
  private _scheduleTypeColors = [
    '#faad14', // gold - 工作日
    '#15ab92', // green - 本休
    '#f5222d', // red - 节假日
    '#faad14', // pink - 存休
    '#15ab92', // green - 调修
    // '#fa8c16', // orange
    '#1890ff', // blue - 事假
    '#1890ff', // blue - 病假
    '#f5222d', // red - 年休假
    '#f5222d', // red - 婚假
    '#f5222d', // red - 产假
    '#f5222d', // red - 陪产假
    '#f5222d', // red - 工伤假
    '#1890ff', // pink - 出差
    '#1890ff', // pink - 其他
    // '#a0d911', // lime
  ];

  private _allScheduleData: { [date: string]: EmployeeSchedule } = null;
  private _confirmedScheduleTypes = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
  private _confirmedStatus = ['3', '4', '5'];
  private _confirmingStatus = ['2'];

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected drawer: NzDrawerService,
    protected authService: AuthService,
    protected employeeService: EmployeeService,
    protected employeeScheduleService: EmployeeScheduleService
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(
      map((queryParams) => {
        const dateObj = utc(queryParams.date || '', 'YYYY-MM', true);
        return dateObj.isValid() ? dateObj.format('YYYY-MM') : '';
      }),
      distinctUntilChanged(),
      map((dateYM) => {
        const filters = {} as { employeeId: string; startDate?: string; endDate?: string; };
        filters.employeeId = this.employeeService.createModel(null, this.authService.getCurrentUser()).id;
        if (dateYM) {
          const dateObj = utc(`${dateYM} +0800`, 'YYYY-MM Z', true).local();
          filters.startDate = dateObj.startOf('month').format('YYYY-MM-DD');
          filters.endDate = dateObj.endOf('month').format('YYYY-MM-DD');
        }
        return filters;
      }),
      tap(() => {
        this.message.loading('数据加载中，请稍候...');
        this.scheduleData = {};
      }),
      mergeMap((filters) => this.employeeScheduleService.getList(Object.assign({}, filters, { meta: 'total,start_date,end_date' }))),
      tap(() => {
        const responseMeta = this.employeeScheduleService.getResponseMetas();
        if (!responseMeta.start_date) {
          throw new Error('服务器响应错误：未知的日历时间');
        }
        this.currentDate = utc(`${responseMeta.start_date} +0800`, 'YYYY-MM-DD Z').local();
        const daysInMonth = this.currentDate.daysInMonth();
        // this.selectedDate = this.currentDate.clone().day(2).toDate();
        const selectedDate = utc(this.selectedDate).local().date();
        this.selectedDate = this.currentDate.clone().date(Math.min(selectedDate, daysInMonth)).toDate();
        this.currentMonthScaleState = 'smaller';
      }),
    ).subscribe((employeeSchedules) => {
      this._buildScheduleData(employeeSchedules);
      this.message.remove();
    }, (e) => {
      this.message.remove();
      this.message.error(e.message || '系统错误，请联系管理员');
    });
  }

  /**
   * 显示当前日历年月
   */
  getCurrentDate() {
    return this.currentDate ? this.currentDate.format('MMM YYYY') : '';
  }

  /**
   * 获得班表类型的颜色
   * @param scheduleType 班表类型枚举值
   */
  getScheduleTypeColor(scheduleType: ScheduleType) {
    if (!scheduleType) { return; }
    return this._scheduleTypeColors[(parseInt(scheduleType.value, 10) - 1) % this._scheduleTypeColors.length];
  }

  /**
   * 根据日期获得班表设置
   * @param date 日期
   */
  getEmployeeScheduleByDate(date: Date) {
    const i = utc(date).local().format('YYYY-MM-DD');
    return this.scheduleData[i] || null;
  }

  /**
   * 当缩小动画完成后替换当前日历月份并触发放大
   * @param e 动画时间
   */
  handleScaleAnimationDone(e: AnimationEvent) {
    if (e.toState === 'smaller' && this.currentDate) {
      this.currentMonthScaleValue = this.currentDate.format('M');
      this.currentMonthScaleState = 'bigger';
    }
  }

  /**
   * 当确认按钮被点击时执行
   */
  handleConfirmButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    const availableScheduleTypes = this.employeeScheduleService.getUnconfirmedScheduleTypes()
      .map((scheduleType) => scheduleType.value);
    const payload: any[] = Object.values(this.scheduleData).filter((employeeSchedule) => {
      if (!employeeSchedule) { return false; }
      return availableScheduleTypes.indexOf(employeeSchedule.type.value) >= 0;
    }).map((employeeSchedule) => ({
      date: employeeSchedule.date,
      type: employeeSchedule.type.value
    }));
    if (payload.length === 0) {
      this.message.error('请先设置班表之后再提交确认');
      return;
    }
    this.loading = true;
    this.cdr.markForCheck();
    this.employeeScheduleService.batchSave({ schedules: payload, employeeId: '_current' }).subscribe((employeeSchedules) => {
      this.loading = false;
      this.message.success('班表提交成功，请耐心等待审核...');
      this._buildScheduleData(employeeSchedules);
    }, (er) => {
      this.loading = false;
      this.message.error(er.message || '系统错误，请联系管理员');
      this.cdr.markForCheck();
    });
  }

  /**
   * 当申请变动按钮被点击时执行
   * @param e 事件
   */
  handleApplyButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this._getConfirmedScheduleEditDrawerRef().afterClose.subscribe(
      (employeeSchedules: EmployeeSchedule[]) => {
        if (!employeeSchedules) { return; }
        employeeSchedules.forEach((employeeSchedule) => {
          this.scheduleData[employeeSchedule.date] = employeeSchedule;
        });
        this.cdr.markForCheck();
      },
      (er) => this.message.error(er.message || '系统错误，请联系管理员')
    );
  }

  handleFilteredScheduleTypeChange(filteredScheduleTypes: ScheduleType[]) {
    if (!this._allScheduleData) {
      this._allScheduleData = this.scheduleData;
    }
    if (filteredScheduleTypes.length === 0) {
      this.scheduleData = this._allScheduleData;
    } else {
      const filteredScheduleData: { [name: string]: EmployeeSchedule } = {};
      const filteredScheduleTypeValues = filteredScheduleTypes.map((filteredScheduleType) => filteredScheduleType.value);
      Object.entries(this._allScheduleData).forEach((entry) => {
        const dayKey = entry[0] as string;
        const daySchedule = entry[1] as EmployeeSchedule;
        if (!daySchedule || filteredScheduleTypeValues.indexOf(daySchedule.type.value) >= 0) {
          filteredScheduleData[dayKey] = daySchedule;
        }
      });
      this.scheduleData = filteredScheduleData;
    }
  }

  /**
   * 上月按钮被点击时执行
   * @param e 事件
   */
  handlePrevMonthClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (this.loading || !this.currentDate) { return; }
    const date = this.currentDate.local().subtract(1, 'month').format('YYYY-MM');
    this.router.navigate(['.'], { queryParams: { date }, relativeTo: this.activatedRoute });
  }

  /**
   * 今日按钮被点击时执行
   * @param e 事件
   */
  handleTodayClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (this.loading || !this.currentDate) { return; }
    this.selectedDate = utc().toDate();
    const date = utc().local().format('YYYY-MM');
    this.router.navigate(['.'], { queryParams: { date }, relativeTo: this.activatedRoute });
  }

  /**
   * 下月按钮被点击时执行
   * @param e 事件
   */
  handleNextMonthClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (this.loading || !this.currentDate) { return; }
    const date = this.currentDate.clone().add(1, 'month').format('YYYY-MM');
    this.router.navigate(['.'], { queryParams: { date }, relativeTo: this.activatedRoute });
  }

  /**
   * 当选中日期时执行
   * @param selectedDate 当前选择的日期
   */
  handleCalendarSelect(selectedDate: Date) {
    const date = utc(selectedDate).local().format('YYYY-MM');
    if (date === this.currentDate.format('YYYY-MM')) {
      if (this.scheduleStatus === 'Confirming') {
        this.message.warning('班表设置审核中，请耐心等待审核结果...');
        return;
      }
      // 点击当前月，进行班表设置
      const selectedDateStr = utc(selectedDate).local().format('YYYY-MM-DD');
      (
        this.scheduleStatus === 'Unconfirmed' ?
          this._getUnconfirmedScheduleEditDrawerRef(selectedDateStr) :
          this._getConfirmedScheduleEditDrawerRef(selectedDateStr)
      ).afterClose.subscribe(
        (employeeSchedules: EmployeeSchedule[]) => {
          if (!employeeSchedules) { return; }
          employeeSchedules.forEach((employeeSchedule) => {
            if (employeeSchedule.type.value === '1' && this.scheduleStatus === 'Unconfirmed') {
              // 工作日且未确认
              this.scheduleData[employeeSchedule.date] = null;
            } else {
              this.scheduleData[employeeSchedule.date] = employeeSchedule;
            }
          });
          if (this.scheduleStatus === 'Unconfirmed') {
            // 未确认时需要缓存数据
            this._cacheEmployeeSchedules(date, Object.values(this.scheduleData));
          }
          this.cdr.markForCheck();
        },
        (e) => this.message.error(e.message || '系统错误，请联系管理员')
      );
    } else {
      // 点击非当前月需要切换日历
      this.router.navigate(['.'], { queryParams: { date }, relativeTo: this.activatedRoute });
    }
  }

  /**
   * 获得未确认班表时的班表设置表单引用
   * @param selectedDate 当前选择的日期字符串
   */
  private _getUnconfirmedScheduleEditDrawerRef(selectedDate: string): NzDrawerRef<EmployeeSchedule[]> {
    const selectedEmployeeSchedule = this.scheduleData[selectedDate] ||
      this.employeeScheduleService.createModel(null, { date: selectedDate, type: '2', status: '1' });
    return this.drawer.create<UnconfirmedScheduleEditComponent, {
      employeeSchedule: EmployeeSchedule
    }, EmployeeSchedule[]>({
      nzWidth: '30%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: UnconfirmedScheduleEditComponent,
      nzContentParams: { employeeSchedule: selectedEmployeeSchedule }
    });
  }

  /**
   * 获得已确认班表时的班表设置表单引用
   * @param selectedDate 当前选择的日期字符串
   */
  private _getConfirmedScheduleEditDrawerRef(selectedDate?: string): NzDrawerRef<EmployeeSchedule[]> {
    const selectedEmployeeSchedule = selectedDate ? (
      this.scheduleData[selectedDate] || this.employeeScheduleService.createModel(null, { date: selectedDate, type: '1' })
    ) : null;
    if (selectedEmployeeSchedule && selectedEmployeeSchedule.status.value === '4') {
      this.message.warning('班表设置审核中，请耐心等待审核结果...');
      return;
    }
    return this.drawer.create<ConfirmedScheduleEditComponent, {
      employeeSchedule: EmployeeSchedule
    }, EmployeeSchedule[]>({
      nzWidth: '30%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: ConfirmedScheduleEditComponent,
      nzContentParams: { employeeSchedule: selectedEmployeeSchedule }
    });
  }

  /**
   * 根据日期获得缓存的班表数据
   * @param date 日期
   */
  private _getCachedEmployeeSchedules(date?: string): EmployeeSchedule[] | { [name: string]: EmployeeSchedule[] } {
    const cachedDataStr = sessionStorage.getItem('employeeSchedules') || '';
    if (!cachedDataStr) { return null; }
    const cachedDataJson = JSON.parse(cachedDataStr);
    return date ? (cachedDataJson[date] || []) : cachedDataJson;
  }

  /**
   * 增加或删除班表数据的缓存
   * @param date 日期
   * @param employeeSchedules 班表数据
   */
  private _cacheEmployeeSchedules(date: string, employeeSchedules?: EmployeeSchedule[]) {
    const cachedDataJson = this._getCachedEmployeeSchedules() || {};
    if (employeeSchedules) {
      cachedDataJson[date] = employeeSchedules;
    } else {
      delete cachedDataJson[date];
    }
    const cachedDataStr = JSON.stringify(cachedDataJson);
    sessionStorage.setItem('employeeSchedules', cachedDataStr);
  }

  /**
   * 组件班表数据
   * @param employeeSchedules 服务器返回的班表数据
   */
  private _buildScheduleData(employeeSchedules: EmployeeSchedule[]) {
    // 清空月班表缓存
    this._allScheduleData = null;
    // 日历状态 Unconfirmed Confirming Confirmed
    this.scheduleStatus =
      employeeSchedules.some((employeeSchedule) => this._confirmedStatus.indexOf(employeeSchedule.status.value) >= 0) ?
        'Confirmed' : (
          employeeSchedules.some((employeeSchedule) => this._confirmingStatus.indexOf(employeeSchedule.status.value) >= 0) ?
            'Confirming' : 'Unconfirmed'
        );

    // 可用的班表类型
    const scheduleTypes = this.employeeScheduleService.getTypes().map((scheduleType, i) => Object.assign({}, scheduleType, {
      disabled: (this.scheduleStatus === 'Unconfirmed' && this._confirmedScheduleTypes.indexOf(scheduleType.value) >= 0),
      color: this._scheduleTypeColors[i % this._scheduleTypeColors.length]
    })) as ScheduleType[];
    this.scheduleTypes$.next(scheduleTypes);

    // 班表数据
    if (this.scheduleStatus === 'Unconfirmed' && employeeSchedules.length === 0) {
      // 如果班表尚未确认 且 服务器返回数据未空 则 尝试从缓存中获得数据
      employeeSchedules = (this._getCachedEmployeeSchedules(this.currentDate.format('YYYY-MM')) || []) as EmployeeSchedule[];
    }

    const daysInMonth = this.currentDate.daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
      const _date = this.currentDate.clone().date(i).format('YYYY-MM-DD');
      this.scheduleData[_date] = employeeSchedules.find((employeeSchedule) => employeeSchedule && employeeSchedule.date === _date) || null;
      if (this.scheduleData[_date] || this.scheduleStatus === 'Unconfirmed') { continue; }
      // 如果班表已确认 服务器不会返回正常工作日数据
      this.scheduleData[_date] = this.employeeScheduleService.createModel(null, { date: _date, type: '1', status: '3' });
    }
  }

}
