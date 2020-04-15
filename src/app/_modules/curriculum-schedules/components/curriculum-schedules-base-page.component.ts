import {
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  EmbeddedViewRef,
  Type,
  ComponentRef, AfterViewInit
} from '@angular/core';
import {
  IBackendPageComponent,
  School,
} from '@uni/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {NzMessageService, NzModalService, NzDrawerService} from 'ng-zorro-antd';
import {CurriculumScheduleModel} from '../models/curriculum-schedule.model';
import {CurriculumSchedulesStateService} from '../services/curriculum-schedules-state.service';
import {CurriculumSchedulesGridComponent} from './curriculum-schedules-grid/curriculum-schedules-grid.component';
import {CurriculumSchedulesListComponent} from './curriculum-schedules-list/curriculum-schedules-list.component';
import {CurriculumSchedulesSearch} from '../models/curriculum-schedules-search.model';
import {CurriculumSchedulesSearchService} from '../_services/curriculum-schedules-search.service';
import {CurriculumSchedulesSearchComponent} from './curriculum-scheduls-search/curriculum-schedules-search.component';
import {CurriculumSchedulesAutoCoursesService} from '../_services/curriculum-schedules-auto-courses.service';
import {CurriculumSchedulesAutoCoursesComponent} from './curriculum-schedules-auto-courses/curriculum-schedules-auto-courses.component';
import {AutoCourses} from '../models/auto-courses';
import {
  CurriculumSchedulesFailureDetailsComponent
} from './curriculum-schedules-failure-details/curriculum-schedules-failure-details.component';
import {CurriculumSchedulesImportExportService} from '../_services/curriculum-schedules-import-export.service';
import {CurriculumSchedulesImportExport} from '../models/curriculum-schedules-import-export.model';
import {CurriculumSchedulesImportComponent} from './curriculum-schedules-import/curriculum-schedules-import.component';

const enum ScheduleTableComponentState {
  Loading = 'loading',
}

interface ModelMenu {
  name: string;
  label: string;
  active: boolean;
  component: Type<{}>;
  componentRef: ComponentRef<any>;
}

export class CurriculumSchedulesBasePageComponent extends IBackendPageComponent implements AfterViewInit, OnDestroy {
  // 排课列表
  public curriculumSchedulesSubject = new BehaviorSubject<CurriculumScheduleModel[]>([]);
  public monthCurriculumSchedulesSubject = new BehaviorSubject<CurriculumScheduleModel[]>([]);
  // 显示模式（用于切换按钮），true为grid排班，false为list列表
  public showGridModel = true;
  // tslint:disable: variable-name
  // 组件加载状态
  protected _componentState;
  protected _scheduleDate: string;
  protected _componentSubscription = new Subscription();
  protected _relativeSchool: School;
  protected _searchConditions: CurriculumSchedulesSearch;
  public modelMenus = [
    {
      name: 'grid',
      label: '排课管理',
      active: false,
      component: CurriculumSchedulesGridComponent,
      componentRef: null
    },
    { name: 'list', label: '排课列表', active: false, component: CurriculumSchedulesListComponent, componentRef: null }
  ];
  @ViewChild('modelMenuContainer', {
    read: ViewContainerRef,
    static: false
  }) protected modelMenuContainer: ViewContainerRef;

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected dataService: CurriculumSchedulesStateService,
    protected modal: NzModalService,
    protected drawer: NzDrawerService,
    protected curriculumScheduleSearchService: CurriculumSchedulesSearchService,
    protected autoCoursesService: CurriculumSchedulesAutoCoursesService,
    protected importExportService: CurriculumSchedulesImportExportService
  ) {
    super(renderer2, injector, cfr);
  }

  ngAfterViewInit(): void {
    this.handleChangeView(this.modelMenus[0]);
  }

  ngOnDestroy(): void {
    this._componentSubscription.unsubscribe();
    this.dataService.clearData();
  }

  /**
   * 获取日排课列表
   */
  protected _reLoadSchedules() {
  }

  public handleLoadingStatus() {
  }

  /**
   * 删除排课
   */
  public handleRemoveSchedule(schedule: CurriculumScheduleModel) {
  }

  /**
   * 处理排课变更
   * @param res ={action 变更方式，schedule 变更排课}
   */
  public handleSchedules(data: any) {
  }

  /**
   * 将教室拖拽到排课，或将排课拖拽到有教室无排课区
   */
  public handleClassroomDrag(data) {
  }

  /**
   * 智能排課
   */
  public handleAddAutoCourses($event) {
    const autoCourses = this.autoCoursesService.createModel() as AutoCourses;
    const drawerRef = this.drawer.create({
      nzWidth: 480,
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: CurriculumSchedulesAutoCoursesComponent,
      nzContentParams: {
        context: autoCourses,
      }
    });
    drawerRef.afterClose.subscribe((context) => {
      // 返回 undefined 代表直接关闭
      if (context === undefined) {
        return;
      }
      this._componentState = ScheduleTableComponentState.Loading;
      this.message.loading('数据加载中，请稍候...', {
        nzDuration: 0
      });
      this._reLoadSchedules();
    });
  }

  /**
   * 搜索
   */
  public handleSearchButtonClick($event) {
    if (!this._searchConditions) {
      this._searchConditions = this.curriculumScheduleSearchService.createModel() as CurriculumSchedulesSearch;
    }
    this.modal.create({
      nzWidth: 480,
      nzBodyStyle: { padding: '0' },
      nzContent: CurriculumSchedulesSearchComponent,
      nzComponentParams: { context: this._searchConditions }
    }).afterClose.subscribe((searchConditions) => {
      // 返回 undefined 代表直接关闭
      if (searchConditions === undefined) {
        return;
      }
      this._searchConditions = searchConditions;
      this._componentState = ScheduleTableComponentState.Loading;
      this.message.loading('数据加载中，请稍候...', {
        nzDuration: 0
      });
      this._reLoadSchedules();
    });
  }

  /**
   * 查看失敗明細
   */
  public handleShowFailureDetails($event) {
    const filters = {
      school_id: this._relativeSchool.id,
      time: this._scheduleDate
    };
    const drawerRef = this.drawer.create({
      nzWidth: 840,
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: CurriculumSchedulesFailureDetailsComponent,
      nzContentParams: {
        extraFilters: filters,
      }
    });
    drawerRef.afterClose.subscribe((context) => {
      // 返回 undefined 代表直接关闭
      if (context === undefined) {
        return;
      }
      this.handleDownloadFailureDetails();
    });
  }

  /**
   * 切换列表和表格视图
   */
  public handleChangeView(modelMenu?: ModelMenu) {
    const activeModelMenu = this.modelMenus.find((menu) => menu.active);
    modelMenu = modelMenu || this.modelMenus.find((menu) => !menu.active) as ModelMenu;
    if (activeModelMenu) {
      if (activeModelMenu.name === modelMenu.name) {
        return;
      }
      activeModelMenu.active = false;
      if (activeModelMenu.componentRef) {
        this.renderer2.removeClass((activeModelMenu.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0], 'renderred');
        this.modelMenuContainer.remove();
        activeModelMenu.componentRef.destroy();
        activeModelMenu.componentRef = null;
      }
    }
    if (!modelMenu.componentRef) {
      const componentFactory = this.cfr.resolveComponentFactory(modelMenu.component);
      modelMenu.componentRef = this.modelMenuContainer.createComponent(componentFactory);
      if (modelMenu.name === 'grid') {
        // tslint:disable: no-string-literal
        modelMenu.componentRef.instance['curriculumSchedulesSubject'] = this.curriculumSchedulesSubject;
        modelMenu.componentRef.instance['handleLoadingStatus'].subscribe(($event) => this.handleLoadingStatus());
        modelMenu.componentRef.instance['handleRemoveSchedule'].subscribe(($event) => this.handleRemoveSchedule($event));
        modelMenu.componentRef.instance['handleSchedules'].subscribe(($event) => this.handleSchedules($event));
        modelMenu.componentRef.instance['handleClassroomDrag'].subscribe(($event) => this.handleClassroomDrag($event));
        this.showGridModel = true;
      }
      if (modelMenu.name === 'list') {
        modelMenu.componentRef.instance['monthCurriculumSchedulesSubject'] = this.monthCurriculumSchedulesSubject;
        modelMenu.componentRef.instance['handleLoadingStatus'].subscribe(($event) => this.handleLoadingStatus());
        this.showGridModel = false;
      }
    } else {
      this.modelMenuContainer.insert(modelMenu.componentRef.hostView);
    }
    setTimeout(() => {
      this.renderer2.addClass((modelMenu.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0], 'renderred');
    }, 100);
    modelMenu.active = true;
  }

  /*导出*/
  handleExport($event) {
    if (this._scheduleDate) {
      this.dataService.handleDownloadSchedules().subscribe((downloadUrl: string) => {
          window.open(downloadUrl);
        },
        (e) => {
          this.message.error(e.message || '系统错误，请联系管理员');
        });
    }
  }

  /*导入*/
  handleImport($event) {
    const importModel = this.importExportService.createModel() as CurriculumSchedulesImportExport;
    const drawerRef = this.drawer.create({
      nzWidth: 480,
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: CurriculumSchedulesImportComponent,
      nzContentParams: {
        context: importModel,
      }
    });
    drawerRef.afterClose.subscribe((context) => {
      // 返回 undefined 代表直接关闭
      if (context === undefined) {
        return;
      }
      this._componentState = ScheduleTableComponentState.Loading;
      this.message.loading('数据加载中，请稍候...', {
        nzDuration: 0
      });
      this._reLoadSchedules();
    });
  }

  /*
* 下载失败明细*/
  public handleDownloadFailureDetails() {
    this.dataService.handleDownloadFailureDetails().subscribe((downloadUrl: string) => {
        window.open(downloadUrl);
      },
      (e) => {
        this.message.error(e.message || '系统错误，请联系管理员');
      });
  }
}
