import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  forwardRef, AfterViewInit, ChangeDetectorRef,
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {INgxExcelDataSource,} from 'ngx-excel';
import {
  IBackendPageComponent,
  BACKEND_PAGE,
  EmployeeService
} from '@uni/core';
import {NzDrawerService, NzMessageService} from 'ng-zorro-antd';
import {TeacherCurriculumSchedulesService} from '../../_services/teacher-curriculum-schedules.service';
import {distinctUntilChanged, map, mergeMap, tap} from 'rxjs/operators';
import {utc} from 'moment';
import {AuthService} from '@uni/common';
import {TeacherCurriculumSchedulesModel} from '../../model/teacher-curriculum-schedules.model';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'backend-page.teaching-diaries',
  templateUrl: './teaching-diaries.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => TeachingDiariesComponent) },
    { provide: INgxExcelDataSource, useExisting: TeacherCurriculumSchedulesService },
  ]
})
export class TeachingDiariesComponent extends IBackendPageComponent implements OnInit, AfterViewInit {
  public initComponentState = 'loading';
  public currentDateSubject = new BehaviorSubject<string>('');

  public schedulesSubject = new BehaviorSubject<TeacherCurriculumSchedulesModel[]>([]);
  public monthSchedulesSubject = new BehaviorSubject<any>({});
  // tslint:disable: variable-name
  private _currentDate: string;
  private _dateSchedules: { [name: string]: TeacherCurriculumSchedulesModel[] };

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected excel: TeacherCurriculumSchedulesService,
    protected drawer: NzDrawerService,
    protected authService: AuthService,
    protected employeeService: EmployeeService,
    protected message: NzMessageService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    super.ngOnInit();
    this.activatedRoute.queryParams.pipe(
      map((queryParams) => {
        const dateObj = (queryParams && queryParams.date) ? utc(queryParams.date).format('YYYY-MM') : '';
        this._currentDate = (queryParams && queryParams.date) ? utc(queryParams.date || '', 'YYYY-MM-DD', true).format('YYYY-MM-DD') : utc().local().format('YYYY-MM-DD');
        return dateObj;
      }),
      distinctUntilChanged(),
      map((dateYM) => {
        const filters = {} as { employeeId: string; startTime?: string; endTime?: string; pageSize: number };
        filters.employeeId = this.employeeService.createModel(null, this.authService.getCurrentUser()).id;
        const date = dateYM ? dateYM : utc().local().format('YYYY-MM');
        const dateObj = utc(`${date} +0800`, 'YYYY-MM Z', true).local();
        filters.startTime = dateObj.startOf('month').format('YYYY-MM-DD');
        filters.endTime = dateObj.endOf('month').format('YYYY-MM-DD');
        filters.pageSize = 1000;
        return filters;
      }),
      tap(() => {
        this.message.loading('数据加载中，请稍候...');
      }),
      mergeMap((filters) => {
        return this.excel.getList(Object.assign({}, filters, { meta: 'total,start_date,end_date' }));
      }),
    ).subscribe((schedule) => {
      this._buildScheduleData(schedule);
      this.currentDateSubject.next(this._currentDate);
      this.initComponentState = 'complete';
      this.message.remove();
    }, (e) => {
      this.message.remove();
      this.message.error(e.message || '系统错误，请联系管理员');
    });
  }

  ngAfterViewInit(): void {
    this.currentDateSubject.subscribe((date: string) => {
      if (this._dateSchedules && date) {
        this.schedulesSubject.next(this._dateSchedules[date] || []);
      }
    });
  }
  /**
   * 按日期组装排课数据
   * @param schedules：老师排课数据
   */
  private _buildScheduleData(schedules: TeacherCurriculumSchedulesModel[]) {
    this._dateSchedules = {};
    if (schedules && schedules.length > 0) {
      for (const item of schedules) {
        this._dateSchedules[item.courseTime] = this._dateSchedules[item.courseTime] ? this._dateSchedules[item.courseTime] : [];
        this._dateSchedules[item.courseTime].push(item);
      }
    }
    this.monthSchedulesSubject.next(this._dateSchedules);
  }
  /**
   * 日期更改
   * @param date：日期
   */
  public handleCalendarChange(date: string) {
    if (utc(date).format('YYYY-MM') === utc(this._currentDate).format('YYYY-MM')) {
      // 列表情况下点击日历，不切换月份无效
      this._currentDate = date;
      this.currentDateSubject.next(date);
    }
    this.router.navigate(['.'], {
      queryParams: { date: utc(date).format('YYYY-MM-DD') },
      relativeTo: this.activatedRoute
    });
  }
  /**
   * 教学日志填写状态更改
   * @param data：更改的排课
   */
  public handleChangeTeachingStatus(data: TeacherCurriculumSchedulesModel) {
    if (this._dateSchedules && this._dateSchedules[this._currentDate]) {
      for (const item of this._dateSchedules[this._currentDate]) {
        if (item.id === data.id) {
          item.teachingUpdate = false;
          item.teachingInsert = true;
          break;
        }
      }
      this.schedulesSubject.next(this._dateSchedules[this._currentDate]);
      this.monthSchedulesSubject.next(this._dateSchedules);
      this.changeDetectorRef.detectChanges();
    }
  }
}
