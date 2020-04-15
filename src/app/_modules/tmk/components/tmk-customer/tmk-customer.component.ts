import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  ChangeDetectorRef,
  Optional,
  Input,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';
import {
  IBackendPageComponent,
  SchoolMenuService
} from '@uni/core';
import {Observable, Subscription} from 'rxjs';
import {NzDrawerRef, NzMessageService, } from 'ng-zorro-antd';
import {distinctUntilChanged, map, mergeMap, tap} from 'rxjs/operators';
import {TmkCustomersService} from '../../services/tmk-customers.service';
import {TmkCustomerFollowRecordService} from '../../services/tmk-customer-follow-record.service';
import {TmkCustomerFollowRecord} from '../../models/tmk-customer-follow-record.model';
import {TmkCustomer} from '../../models/tmk-customer.model';
@Component({
  selector: 'tmk-customer',
  templateUrl: './tmk-customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomerComponent extends IBackendPageComponent implements OnInit {
  customerFollowRecord: TmkCustomerFollowRecord = null;
  isPublic = true;
  // tslint:disable: variable-name
  private _currentCustomer: TmkCustomer;
  private _componentSubscription = new Subscription();
  @Input() customerId$: Observable<string>;
  @Input() componentMode: 'portlet' | 'page';
  @HostBinding('class.layout') layoutClass: boolean;
  constructor(
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected customerService: TmkCustomersService,
    protected tmkFollowRecordService: TmkCustomerFollowRecordService,
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
      mergeMap(({ customerId, schoolId }) => this.customerService.getModel(customerId, { schoolId })),
    ).subscribe(
      (customer) => {
        this.customerFollowRecord = this.tmkFollowRecordService.createModel();
        this._currentCustomer = customer as TmkCustomer;
        this.isPublic = this._currentCustomer.isPublic;
        this.customerFollowRecord.relativeMarketingCustomer = this._currentCustomer;
        this.cdr.detectChanges();
      },
      (e) => this.message.error(e.message || '系统错误，请联系管理员')
    );
    this._componentSubscription.add(reloadSubscription);
  }

  handleRedirectButtonClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.drawerRef) {
      this.drawerRef.close(this._currentCustomer);
    }
  }
  followSuccess() {
    if (this.drawerRef) {
      this.drawerRef.close(true);
    }
  }

}
