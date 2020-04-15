import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ElementRef, Renderer2
} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import * as moment from 'moment';
import {
  NzMessageService, NzDrawerService
} from 'ng-zorro-antd';
import {CurriculumScheduleModel} from '../../models/curriculum-schedule.model';
import {TeachingResourceModel} from '../../models/teaching-resource.model';
import {distinctUntilChanged, filter, tap, mergeMap} from 'rxjs/operators';
import {Classroom, ProductService, SelectOption} from '@uni/core';
import {ContextMenuComponent, ContextMenuService} from 'ngx-contextmenu';
import {CurriculumSchedulesEditComponent} from '../curriculum-schedules-edit/curriculum-schedules-edit.component';
import {
  CurriculumSchedulesSigningClassComponent
} from '../curriculum-schedules-signing-class/curriculum-schedules-signing-class.component';
import {CurriculumSchedulesStateService} from '../../services/curriculum-schedules-state.service';
import {CurriculumSchedulesBaseGridComponent} from './curriculum-schedules-base-grid.component';


@Component({
  selector: 'curriculum-schedules-grid',
  templateUrl: './curriculum-schedules-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurriculumSchedulesGridComponent extends CurriculumSchedulesBaseGridComponent implements OnInit, OnDestroy {

  // 校区排课按教室时间分类列表
  public curriculumSchedules = [];
  // 校区已排课所有教室列表
  public classrooms = [];
  // 右键选中排课
  public scheduleContext: CurriculumScheduleModel;
  public dragIsStart = false;
  public signBtnVisible = false;
  // 允许排课开始结束时间
  // tslint:disable: variable-name
  // 排课日期
  public scheduleDate: string;
  private _scheduleRow;
  // 排课原始数据
  private _schedules = [];
  // 校区不可用资源
  private _schoolResource: { [name: string]: TeachingResourceModel };
  private _scheduleClassroom: Classroom;
  // 编辑内容
  private _editType: string;
  private _scheduleIsConfirm = false;
  // 排课右上角图标颜色
  private _scheduleTypeColors = [];
  // 排课列表
  @Input() curriculumSchedulesSubject: Observable<CurriculumScheduleModel[]>;
  @Output() handleSchedules = new EventEmitter<{ [name: string]: any }>();
  @Output() handleRemoveSchedule = new EventEmitter<CurriculumScheduleModel>();
  @Output() handleLoadingStatus = new EventEmitter<any>();

  constructor(
    protected message: NzMessageService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected drawer: NzDrawerService,
    protected productService: ProductService,
    protected el: ElementRef,
    protected renderer2: Renderer2,
    protected dataService: CurriculumSchedulesStateService,
    protected contextMenuService: ContextMenuService,
  ) {
    super(message, changeDetectorRef, drawer, productService, el, renderer2, dataService);
  }

  ngOnInit() {
    this._scheduleTypeColors = this.dataService.getScheduleStatusColors();
    this._componentSubscription.add(combineLatest(this.curriculumSchedulesSubject).pipe(
      distinctUntilChanged(),
      tap((curriculumSchedules) => {
        this._schedules = curriculumSchedules[0];
        this.scheduleDate = this.dataService.getCurrentDate();
        this._scheduleIsConfirm = this.dataService.judgeScheduleIsConfirm();
      }),
      mergeMap(() => {
        return this.dataService.getTeachingResource();
      }),
      tap((resource) => {
        this._schoolResource = resource;
      })
      ).subscribe(
      () => {
        this._analysisData();
        setTimeout(() => (this._setScrollBarWidth()), 200);
      },
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
      )
    );
  }

  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 解析排课数据
   */
  private _analysisData() {
    this.curriculumSchedules = [];
    this._columnCount = 0;
    if (this._schoolResource) {
      this.classrooms = this.dataService.getSchedulesClassRooms(this._schoolResource);
      this.curriculumSchedules = this.dataService.getClassroomSchedulesData(this._schoolResource);
      this.handleLoadingStatus.emit();
    }
    this._columnCount = this.dataService.getColumnCount();
    this.changeDetectorRef.markForCheck();
  }

  /**
   * 右键显示上下文菜单
   * @param e 当前上下文 _item当前行数据 tpl模板 index 当所在行对应列索引 schedule当前排课
   */
  public onContextMenu(e: MouseEvent, _item: any, tpl: ContextMenuComponent, index, schedule?: CurriculumScheduleModel) {
    e.preventDefault();
    e.stopPropagation();
    this._editType = '';
    if (_item.schoolResource && _item.schoolResource.allTeachers && _item.schoolResource.allClassrooms && !schedule) {
      return;
    }
    this._scheduleRow = _item;
    this.scheduleContext = schedule ? schedule : null;
    if (!this.scheduleContext) {
      this._scheduleClassroom = this.classrooms[index - (_item.schedules.length - this.classrooms.length)];
      // 教室被禁用
      if (this._scheduleClassroom && this._scheduleClassroom.status && this._scheduleClassroom.status.value === '0') {
        return;
      }
    }
    this.contextMenuService.show.next({
      contextMenu: tpl,
      event: e,
      item: _item,
    });
    this._signEntryAble();
  }

  /**
   * 左键查看详情
   * @param e 当前上下文 _item当前行数据 tpl模板 index 当所在行对应列索引 schedule当前排课
   */
  public onDetailClick(e: MouseEvent, _item: any, tpl: ContextMenuComponent, index, schedule?: CurriculumScheduleModel) {
    e.preventDefault();
    e.stopPropagation();
    this._scheduleRow = _item;
    this.scheduleContext = schedule ? schedule : null;
    if (!this.scheduleContext) {
      this._scheduleClassroom = this.classrooms[index - (_item.schedules.length - this.classrooms.length)];
    }
    this.showEdit('detail');
  }

  /**
   * 编辑排课
   */
  public showEdit(type: string) {
    if (this.scheduleContext) {
      this._editType = type;
      if (this.scheduleContext.id && this.scheduleContext.status.value === '2' && type === 'entry'
        && this.judgeMultiProductType(this.scheduleContext.curriculum.relativeProduct.type)) {
        this.message.warning('当前排课状态每次只能修改一个上课名单');
      }
      if (this.judgeMultiProductType(this.scheduleContext.curriculum.relativeProduct.type)) {
        this.showEditDrawer('multiple');
      } else {
        this.showEditDrawer();
      }
    }
  }

  /**
   * 删除排课
   */
  public onDelete() {
    if (this.scheduleContext) {
      this.handleRemoveSchedule.emit(this.scheduleContext);
    }
  }

  /**
   * 新增/编辑排课
   * @param _type 1多人，2一对一
   */
  public showEditDrawer(_type?: string) {
    const drawerRef = this.drawer.create({
      nzWidth: 720,
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: CurriculumSchedulesEditComponent,
      nzContentParams: {
        contextRow: Object.assign({}, this._scheduleRow),
        schedule: this.scheduleContext,
        scheduleClassroom: this._scheduleClassroom,
        operateType: _type,
        editType: this._editType ? this._editType : ''
      }
    });
    drawerRef.afterClose.pipe(
      filter((_schedule) => !!_schedule)
    ).subscribe((_schedule) => {
      if (_schedule === undefined) {
        return;
      }
      this.handleSchedules.emit({
        schedule: _schedule,
        action: (this.scheduleContext && this.scheduleContext.id) ? 'update' : 'add'
      });
    });
  }

  /**
   * 签课
   */
  public showSigningDrawer() {
    const drawerRef = this.drawer.create({
      nzWidth: 840,
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: CurriculumSchedulesSigningClassComponent,
      nzContentParams: {
        schedule: this.scheduleContext,
      }
    });
    drawerRef.afterClose.pipe(
      filter((_schedule) => !!_schedule)
    ).subscribe((_schedule) => {
      this.handleSchedules.emit({
        schedule: _schedule,
        action: 'update'
      });
    });
  }

  /**
   * 判断是否为ETP类型
   */
  public judgeMultiProductType(type: SelectOption): boolean {
    const _selectOptions: SelectOption[] = this.productService.getMultiStudentProductTypes();
    const selectOption = _selectOptions.find( (item) => item.value === type.value);
    return selectOption ? true : false;
  }

  /**
   * 判断教室是否禁用
   */
  public judgeClassroomIsNotAble(item: any, index: number): boolean {
    const classroom = this.classrooms[index - (item.schedules.length - this.classrooms.length)];
    return classroom ? classroom.status.value === '0' : false;
  }

  /**
   * 判断签课按钮是否可见
   */
  private _signEntryAble() {
    this.signBtnVisible = false;
    if (this.scheduleContext && this.scheduleContext.status && ['2', '5'].includes(this.scheduleContext.status.value)) {
      const days = moment(moment(this.scheduleContext.time).format('YYYY-MM-DD')).diff(moment().local(), 'day');
      // 历史数据才可以签课
      if (days <= -1) {
        this.signBtnVisible = true;
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  /**
   * 获取排课右上角状态颜色
   */
  public getScheduleStatusBlockColor(schedule) {
    const date = moment(schedule.time).format('YYYY-MM-DD');
    let index = schedule.status.value;
    if (index === '2') {
      // 已排课
      const days = moment(date).diff(moment().local(), 'day');
      if (days <= -1) {
        index = '6';
      }
    }
    // 已签课状态不需要显示
    return index && index !== '5' ? this._scheduleTypeColors[parseFloat(index) - 1] : '';
  }
}
