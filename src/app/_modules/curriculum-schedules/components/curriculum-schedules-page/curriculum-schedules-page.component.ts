import {
  Component,
  Renderer2,
  OnInit,
  Injector,
  ComponentFactoryResolver,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  BACKEND_PAGE,
  Classroom,
  School,
  SchoolMenuService,
} from '@uni/core';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map, distinctUntilChanged, tap} from 'rxjs/operators';
import {NzMessageService, NzModalService, NzDrawerService} from 'ng-zorro-antd';
import {CurriculumScheduleModel} from '../../models/curriculum-schedule.model';
import {CurriculumSchedulesStateService} from '../../services/curriculum-schedules-state.service';
import {utc} from 'moment';
import {CurriculumScheduleService} from '../../_services/curriculum-schedule.service';
import {CurriculumSchedulesSearchService} from '../../_services/curriculum-schedules-search.service';
import {CurriculumSchedulesBasePageComponent} from '../curriculum-schedules-base-page.component';
import {CurriculumSchedulesAutoCoursesService} from '../../_services/curriculum-schedules-auto-courses.service';
import {CurriculumSchedulesImportExportService} from '../../_services/curriculum-schedules-import-export.service';

const enum ScheduleTableComponentState {
  Loading = 'loading',
  Initial = 'initial',
  Complete = 'complete'
}

@Component({
  selector: 'backend-page.curriculum-schedules-page',
  templateUrl: './curriculum-schedules-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => CurriculumSchedulesPageComponent) },
  ]
})
export class CurriculumSchedulesPageComponent extends CurriculumSchedulesBasePageComponent implements OnInit, AfterViewInit {

  // 初始化组件状态
  public initComponentState;
  // 教室列表
  public classroomListSubject = new BehaviorSubject<Classroom[]>([]);
  // 排班日期
  public scheduleDateSubject = new BehaviorSubject<string>(null);
  // 当前排课是否确认
  public scheduleIsConfirm = false;
  // 当前排课是否完整（及所有排课都必须包含课程/老师/实体）,判断确认按钮disabled
  public scheduleIsComplete = true;
  public btnLoading = false;

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected message: NzMessageService,
    protected cfr: ComponentFactoryResolver,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected schoolMenuService: SchoolMenuService,
    protected dataService: CurriculumSchedulesStateService,
    protected curriculumScheduleService: CurriculumScheduleService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected modal: NzModalService,
    protected drawer: NzDrawerService,
    protected curriculumScheduleSearchService: CurriculumSchedulesSearchService,
    protected autoCoursesService: CurriculumSchedulesAutoCoursesService,
    protected importExportService: CurriculumSchedulesImportExportService
  ) {
    // tslint:disable: max-line-length
    super(renderer2, injector, cfr, message, dataService, modal, drawer, curriculumScheduleSearchService, autoCoursesService, importExportService);
  }

  ngOnInit() {
    super.ngOnInit();
    // 初始化界面状态
    this.initComponentState = ScheduleTableComponentState.Initial;
    // 监听路由参数日期，校区变化
    this._componentSubscription.add(combineLatest(this.activatedRoute.queryParams, this.schoolMenuService.currentSchool$).pipe(
      map((resultSet) => {
        const params = resultSet[0];
        const currentSchool = resultSet[1];
        return {
          date: params.date ? params.date : '',
          school: currentSchool
        };
      }),
      distinctUntilChanged(),
      tap((param) => {
        // 初始化加载状态
        this._initComponentState(param.date, param.school as School);
        this.message.loading('数据加载中，请稍候...', {
          nzDuration: 0
        });
        return param;
      }),
      map((param) => {
        if (param.date) {
          this._scheduleDate = param.date;
          this.scheduleDateSubject.next(this._scheduleDate);
        }
        // this._relativeSchool.next(param.school as School);
        return param.school as School;
      })
      ).subscribe((newSchool) => {
        this.dataService.setFilters({ date: this._scheduleDate, school: newSchool });
        if (this._relativeSchool && (this._relativeSchool.id === newSchool.id)) {
          this._reLoadSchedules();
        } else {
          this._relativeSchool = newSchool;
          // 获取教室列表
          this.dataService.getClassRooms().subscribe((data: Classroom[]) => {
            this.classroomListSubject.next(data);
            this._reLoadSchedules();
          }, (e) => {
            this.message.remove();
            this.message.error(e.message || '系统错误，请联系管理员');
          });
          this.changeDetectorRef.detectChanges();
        }
      },
      (e) => {
        this.message.remove();
        this.message.error(e.message || '系统错误，请联系管理员');
      }
      )
    );
    // 订阅排课变更
    this._componentSubscription.add(this.dataService.getChangeScheduleSubject().subscribe((data: CurriculumScheduleModel) => {
        this.handleSchedules({ action: 'update', schedule: data });
      })
    );
    // 订阅排课月数据
    this._componentSubscription.add(this.dataService.getMonthSchedulesSubject().pipe(
      distinctUntilChanged(),
      ).subscribe((res) => {
        this.monthCurriculumSchedulesSubject.next(res);
      })
    );
    // 订阅日期排课数据
    this._componentSubscription.add(this.curriculumSchedulesSubject.subscribe((res) => {
        this.scheduleIsConfirm = this._judgeScheduleIsConfirm(res);
        if (!this.scheduleIsConfirm) {
          this.scheduleIsComplete = this._judgeScheduleComplete(res);
        }
        this.changeDetectorRef.markForCheck();
      })
    );
  }
  /**
   * 设置页面数据加载状态
   * @param date 日期 school 校区
   * 注： 1. 初始化：加载状态 Initial > loading > Complete
   *      2. 变更排课数据： 加载状态 loading > Complete
   */
  private _initComponentState(date: string, school: School) {
    if (date && this._scheduleDate) {
      // 当月份和校区都不变的时候从loading开始，因为不用监听日历渲染情况；否则从Initial开始
      if (utc(date).local().format('YYYY-MM') === utc(this._scheduleDate).local().format('YYYY-MM')
        && this._relativeSchool.id === school.id) {
        this._componentState = ScheduleTableComponentState.Loading;
      } else {
        this._componentState = ScheduleTableComponentState.Initial;
      }
    } else {
      this._componentState = ScheduleTableComponentState.Initial;
    }
  }

  /**
   * 获取日排课列表
   */
  protected _reLoadSchedules() {
    const extraFilters = Object.assign(
      {},
      {  school_id: this._relativeSchool.id, start_date: this._scheduleDate || '', end_date: this._scheduleDate || ''},
      this._searchConditions ? this.curriculumScheduleSearchService.getConditions(this._searchConditions) : {}
    );
    this.dataService.getDateSchedules(extraFilters).pipe(
    ).subscribe((res: CurriculumScheduleModel[]) => {
      if (!this._scheduleDate) { // 初始化界面时获取服务器时间
        const meta = this.curriculumScheduleService.getResponseMetas();
        this._scheduleDate = meta.start_date || meta.end_date || utc().local().format('YYYY-MM-DD');
        this.dataService.setFilters({ date: this._scheduleDate });
        this.scheduleDateSubject.next(this._scheduleDate);
      }
      this.curriculumSchedulesSubject.next(res);
    }, (err) => this.message.error(err.message || err));
  }

  /**
   * 删除排课
   */
  public handleRemoveSchedule(schedule: CurriculumScheduleModel) {
    this.message.loading('数据请求中，请稍候...', {
      nzDuration: 0
    });
    this.curriculumScheduleService.destroy(schedule, { school_id: this._relativeSchool.id }).subscribe((newSchedule) => {
        this.message.remove();
        if (newSchedule.status.value === '1') {
          this.handleSchedules({ schedule: newSchedule, action: 'delete' });
        } else if (schedule.status.value !== newSchedule.status.value) {
          this.handleSchedules({
            schedule: Object.assign(schedule, { status: newSchedule.status }),
            action: 'update'
          });
        }
      },
      (e) => {
        this.message.remove();
        this.message.error(e.message || '系统错误，请联系管理员');
      });
  }

  /**
   * 处理排课变更
   * @param res ={action 变更方式，schedule 变更排课}
   */
  public handleSchedules(data: any) {
    this.curriculumSchedulesSubject.next(this.dataService.handleScheduleChange(data));
  }

  /**
   * 日历变更
   * @param date 变更日期
   */
  public handleCalendarChange(date: string) {
    if (!this.showGridModel && (utc(date).format('YYYY-MM') === utc(this._scheduleDate).format('YYYY-MM'))) {
      // 列表情况下点击日历，不切换月份无效
      this.scheduleDateSubject.next(this._scheduleDate);
    } else if (this._componentState === ScheduleTableComponentState.Complete) {
      this.router.navigate(['.'], { queryParams: { date }, relativeTo: this.activatedRoute });
    } else {
      // 未加载完成还原日期
      this.scheduleDateSubject.next(this._scheduleDate);
    }
  }

  /**
   * 日历显示数据处理完成
   */
  public handleLoadingStatus() {
    if (this._componentState === ScheduleTableComponentState.Initial) {
      this._componentState = ScheduleTableComponentState.Loading;
    } else if (this._componentState === ScheduleTableComponentState.Loading) {
      this.initComponentState = ScheduleTableComponentState.Complete;
      this._componentState = ScheduleTableComponentState.Complete;
      this.message.remove();
    }
  }

  /**
   * 确认课表
   */
  public handleConfirmSchedules() {
    if (this.btnLoading) {
      return;
    }
    this.btnLoading = true;
    this.dataService.handleConfirmSchedules().subscribe((res: CurriculumScheduleModel[]) => {
        this.curriculumSchedulesSubject.next(res);
        this.dataService.handleScheduleChange({ action: 'update', schedule: res });
        this.btnLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      (e) => {
        this.message.error(e.message || '系统错误，请联系管理员');
        this.btnLoading = false;
        this.changeDetectorRef.markForCheck();
      });
  }
  /**
   * 判断排课是否已确认
   */
  private _judgeScheduleIsConfirm(res): boolean {
    this.scheduleIsConfirm = false;
    this.scheduleIsComplete = true;
    if (res && res.length > 0) {
      // 有排课的情况
      return (res[0].status.value !== '1');
    } else {
      return false;
    }
  }

  /**
   * 判断当前日期排课是否全部完整
   * 判断条件存在实体/老师/课程
   */
  private _judgeScheduleComplete(res): boolean {
    if (res && res.length > 0) {
      for (const item of res) {
        if (!item.relativeEntries || (item.relativeEntries.length <= 0) || !item.teacher || !item.curriculum) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * 将排课拖拽到教室
   */
  public handleScheduleDrag(data) {
    try {
      // tslint:disable: no-string-literal
      const classroom = data.container.data[0]['classroom'] as Classroom;
      const scheduleData = data.item.data;
      this._setScheduleClassroom(classroom, scheduleData);
    } catch (err) {
      this.message.error(err.message || '系统错误，请联系管理员');
    }
  }

  /**
   * 将教室拖拽到排课，或将排课拖拽到有教室无排课区
   */
  public handleClassroomDrag(data) {
    try {
      // tslint:disable: no-string-literal
      const classroom = data.item.data['classroom'] as Classroom;
      const oldSchedule = data.item.data['schedule'];
      const scheduleData = data.container.data[0];
      if (oldSchedule && scheduleData && scheduleData.schedule) {
        // 两个排课拖拽
        return;
      } else if (classroom && scheduleData && scheduleData.schedule) {
        // 教室拖拽到排课
        this._setScheduleClassroom(classroom, scheduleData);
      } else if (oldSchedule && scheduleData && data.item.data.schoolResource) {
        // 无教室排课拖拽到有教室无排课区
        this._setScheduleClassroom(scheduleData.classroom, {
          schedule: oldSchedule,
          schoolResource: data.item.data.schoolResource
        });
      }

    } catch (err) {
      this.message.error(err.message || '系统错误，请联系管理员');
    }
  }

  /**
   * 设置排课教室
   * @param _classroom将要设置得教室 _scheduleData {schedule: 排课，classroomList： 不可用教室资源}
   */
  private _setScheduleClassroom(classroom: Classroom, scheduleData: any) {
    if (classroom && scheduleData && scheduleData.schedule) {
      /*  const _classRoomResource = _scheduleData.schoolResource.classrooms as Classroom[];
      if (_classRoomResource && _classRoomResource.length > 0) {
          for (const item of _classRoomResource) {
            if (_classroom.id.toString() === item.id.toString()) {
              this.message.error('该时段教室已被占用');
              return;
            }
          }
        }*/
      this.message.loading('教室变更中，请稍候...');
      this.dataService.setScheduleClassroom(classroom, scheduleData).subscribe((res) => {
        this.message.remove();
        this.handleSchedules({ action: 'update', schedule: res });
      }, (err) => {
        this.message.remove();
        this.message.error(err.message || '系统错误，请联系管理员');
      });
    }
  }
}
