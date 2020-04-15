import {
  ChangeDetectorRef,
  Injector,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Input,
  ComponentRef,
  Type,
  StaticProvider
} from '@angular/core';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { Student, SchoolMenuService, School } from '@uni/core';
import { CartType } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { CurriculumManagerService } from '../../services/curriculum-manager.service';
import { CurriculumBlockComponent } from '../curriculum-blocks/curriculum-block-component';
import { Subscription, Observable } from 'rxjs';
import { filter, distinctUntilChanged, mergeMap, tap } from 'rxjs/operators';

export abstract class CurriculumFlowComponent implements OnInit, OnDestroy, AfterViewInit {

  loading: boolean;
  componentReady: boolean;

  protected componentSubscription = new Subscription();
  protected currentSchool: School = null;
  protected currentStudent: Student = null;
  protected cartService: CartService = null;

  @Input() student$: Observable<Student>;
  @Input() cartType: CartType;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected curriculumManagerService: CurriculumManagerService,
    protected drawerRef: NzDrawerRef
  ) { }

  ngOnInit() {
    this.componentReady = false;
    this.loading = false;
  }

  ngOnDestroy() {
    this.componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const reloadSubscription = this.student$.pipe(
      filter((student) => !!student),
      distinctUntilChanged((o1, o2) => o1.id === o2.id),
      mergeMap((student) => {
        this.currentStudent = student;
        this.currentSchool = this.schoolMenuService.currentSchool as School;
        return this.curriculumManagerService.getCartService(this.currentSchool, this.currentStudent, this.cartType);
      }),
      tap((cartService) => this.cartService = cartService)
    ).subscribe(
      () => this.initial(),
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
    this.componentSubscription.add(reloadSubscription);
  }

  dismiss(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.drawerRef.close();
  }

  /**
   * 创建课程操作流程块级组件
   * @param componentType 组件类型
   */
  protected createCurriculumBlock<T extends CurriculumBlockComponent>(componentType: Type<T>): ComponentRef<T> {
    const componentFactory = this.cfr.resolveComponentFactory(componentType);
    const componentInjector = this.getComponentInjector();
    return componentFactory.create(componentInjector);
  }

  /**
   * 获得扩展组件注入
   * @param customInjectors 自定义的注入列表
   */
  protected getComponentInjector(customInjectors?: StaticProvider[]) {
    const providers: StaticProvider[] = [
      { provide: CartService, useValue: this.cartService }
    ];
    if (customInjectors) {
      providers.push(...customInjectors);
    }
    return Injector.create({ providers, parent: this.injector });
  }

  /**
   * 当确认按钮被点击时执行
   */
  public abstract confirm(e: Event): void;

  /**
   * 初始化动作
   */
  protected abstract initial(): void;

}
