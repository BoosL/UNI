import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  OnDestroy,
  Input,
  Output,
  HostBinding,
  EventEmitter,
  Optional,
  ChangeDetectorRef,
  ComponentRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IBackendPageComponent, School, SchoolService } from '@uni/core';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { SchoolCurriculumManagerComponent } from '../school-curriculum-manager/school-curriculum-manager.component';
import { SchoolClassroomsComponent } from '../school-classrooms/school-classrooms.component';
import { SchoolRestTimeComponent } from '../school-rest-time/school-rest-time.component';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { distinctUntilChanged, tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'school',
  templateUrl: './school.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  school$ = new BehaviorSubject<School>(null);
  layoutMenus = [
    { name: 'curriculum_manager', label: '校区可售课程', active: false, component: SchoolCurriculumManagerComponent },
    { name: 'classrooms', label: '校区教室管理', active: false, component: SchoolClassroomsComponent },
    { name: 'rest_time', label: '休息时间管理', active: false, component: SchoolRestTimeComponent }
  ];

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _currentSchool: School = null;

  @Input() componentMode: 'portlet' | 'page';
  @Input() schoolId$: Observable<string>;
  @Output() actionButtonClick = new EventEmitter();
  @HostBinding('class.layout') layoutClass: boolean;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected schoolService: SchoolService,
    @Optional() protected drawerRef: NzDrawerRef
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.componentMode = this.componentMode || 'page';
    this.layoutClass = this.componentMode === 'page';
    const reloadSubscription = this.schoolId$.pipe(
      distinctUntilChanged(),
      tap(() => this.message.loading('数据加载中，请稍候...')),
      mergeMap((schoolId) => this.schoolService.getModel(schoolId)),
      tap(() => this.message.remove())
    ).subscribe(
      (school) => {
        this._currentSchool = school;
        this.school$.next(school);
        this.handleMenuClick(this.layoutMenus[0]);
        this.cdr.detectChanges();
      },
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
    this._componentSubscription.add(reloadSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 点击页面方式打开时执行
   * @param e 事件
   */
  handleRedirectButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    if (this.drawerRef) {
      this.drawerRef.close(this._currentSchool);
    }
  }

  /**
   * 绑定校区教室列表的组件参数
   * @param component 原组件
   */
  protected createClassroomsComponent(component: ComponentRef<SchoolClassroomsComponent>) {
    component.instance.school$ = this.school$;
    return component;
  }

  /**
   * 绑定校区时间管理的组件参数
   * @param component 原组件
   */
  protected createRestTimeComponent(component: ComponentRef<SchoolRestTimeComponent>) {
    component.instance.school$ = this.school$;
    return component;
  }

  /**
   * 绑定校区可售课程管理的组件参数
   * @param component 原组件
   */
  protected createCurriculumManagerComponent(component: ComponentRef<SchoolCurriculumManagerComponent>) {
    component.instance.school$ = this.school$;
    return component;
  }

}
