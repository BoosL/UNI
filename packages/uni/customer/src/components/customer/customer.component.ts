import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ComponentRef,
  Output,
  EventEmitter,
  Input,
  Renderer2,
  ComponentFactoryResolver,
  Injector,
  HostBinding,
  ChangeDetectorRef,
  Optional,
} from '@angular/core';
import { SchoolMenuService, IBackendPageComponent } from '@uni/core';
import { MarketingCustomerService } from '../../services/marketing-customer/marketing-customer.service';
import { CustomerInfoComponent } from '../customer-info/customer-info.component';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { CustomerVersionsComponent } from '../customer-versions/customer-versions.component';
import { CustomerTimelineComponent } from '../customer-timeline/customer-timeline.component';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged, tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerComponent extends IBackendPageComponent implements OnInit, OnDestroy {

  customer$ = new BehaviorSubject<MarketingCustomer>(null);
  layoutMenus = [
    { name: 'info', label: '客户信息', active: false, component: CustomerInfoComponent },
    { name: 'versions', label: '修改记录', active: false, component: CustomerVersionsComponent },
    { name: 'timeline', label: '事件记录', active: false, component: CustomerTimelineComponent }
  ];

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _currentCustomer: MarketingCustomer = null;

  @Input() componentMode: 'portlet' | 'page';
  @Input() customerId$: Observable<string>;
  @Output() actionButtonClick = new EventEmitter();
  @HostBinding('class.layout') layoutClass: boolean;

  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected customerService: MarketingCustomerService,
    @Optional() protected drawerRef: NzDrawerRef
  ) {
    super(renderer2, injector, cfr);
  }

  ngOnInit() {
    this.componentMode = this.componentMode || 'page';
    this.layoutClass = this.componentMode === 'page';
    const reloadSubscription = this.customerId$.pipe(
      distinctUntilChanged(),
      map((customerId) => {
        const currentSchool = this.schoolMenuService.currentSchool;
        const schoolId = currentSchool && currentSchool.id !== '-1' ? currentSchool.id : '';
        return { customerId, schoolId };
      }),
      tap(() => this.message.loading('数据加载中，请稍候...')),
      mergeMap(({ customerId, schoolId }) => this.customerService.getModel(customerId, { schoolId })),
      tap(() => this.message.remove())
    ).subscribe(
      (customer) => {
        this._currentCustomer = customer;
        this.customer$.next(customer);
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
      this.drawerRef.close(this._currentCustomer);
    }
  }

  /**
   * 绑定客户扩展信息的组件参数
   * @param component 原组件
   */
  protected createInfoComponent(component: ComponentRef<CustomerInfoComponent>) {
    component.instance.customer$ = this.customer$;
    return component;
  }

  /**
   * 绑定客户修改记录的组件参数
   * @param component 原组件
   */
  protected createVersionsComponent(component: ComponentRef<CustomerVersionsComponent>) {
    component.instance.customer$ = this.customer$;
    return component;
  }

  /**
   * 绑定客户事件记录的组件参数
   * @param component 原组件
   */
  protected createTimelineComponent(component: ComponentRef<CustomerTimelineComponent>) {
    component.instance.customer$ = this.customer$;
    return component;
  }

}
