import { Component, OnInit, ChangeDetectionStrategy, forwardRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { BACKEND_PAGE } from '@uni/core';
import {
  MarketingCustomer,
  CustomersComponent
} from '@uni/customer';
import { BaseCustomerWrapperComponent } from '../base-customer-wrapper-component';
import { Subscription, BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'backend-page.partial-customers',
  templateUrl: './partial-customers-page.component.html',
  providers: [
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => PartialCustomersPageComponent) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartialCustomersPageComponent extends BaseCustomerWrapperComponent implements OnInit, OnDestroy, AfterViewInit {

  pageTitle: string;
  pageBreadcrumb: Array<{ label: string }>;
  partialConfig: any;
  schoolId$: Observable<string>;

  // tslint:disable: variable-name
  private _partialSettings: { [key: string]: any } = {
    old_call: { name: 'old_call', label: 'Old Call' },
    consulted: { name: 'consulted', label: '已咨询客户列表' },
    has_deposit: { name: 'has_deposit', label: '订金客户列表' }
  };
  private _schoolIdSubject = new BehaviorSubject<string>(null);
  private _componentSubscription = new Subscription();

  @ViewChild(CustomersComponent, { static: false }) customersComponent: CustomersComponent;

  ngOnInit() {
    this.initSchemeConfig();
    this.schoolId$ = this._schoolIdSubject.asObservable();
    this.pageBreadcrumb = [...this.activatedRoute.snapshot.data.pageBreadcrumb];
    this.pageBreadcrumb.unshift({ label: this.activatedRoute.snapshot.data.pageTitle });
    this.activatedRoute.params.subscribe((params) => {
      let scope = params.scope || 'old_call';
      if (this._partialSettings[scope] === undefined) { scope = 'old_call'; }
      this.pageTitle = this._partialSettings[scope].label;
    });
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const reloadSubscription = combineLatest(this.activatedRoute.params, this.schoolMenuService.currentSchool$).pipe(
      map((resultSet) => {
        const payload = {
          scope: 'old_call',
          school: null
        };
        payload.scope = resultSet[0] ? resultSet[0].scope : 'old_call';
        payload.school = resultSet[1] && resultSet[1].id !== '-1' ? resultSet[1].id : null;
        if (this._partialSettings[payload.scope] === undefined) { payload.scope = 'old_call'; }
        return payload;
      }),
      distinctUntilChanged((o1, o2) => o1.scope === o2.scope && o1.school === o2.school),
      tap((payload) => {
        this.partialConfig = this._partialSettings[payload.scope];
        this.cdr.detectChanges();
      })
    ).subscribe(
      () => this._reload()
    );
    this._componentSubscription.add(reloadSubscription);
  }

  /**
   * @inheritdoc
   */
  /* protected detail(customer: MarketingCustomer) {
    this.router.navigate(['../cc-customers', customer.id], { relativeTo: this.activatedRoute });
  } */

  /**
   * 跳转到客户咨询记录
   * @param customer 当前客户
   */
  protected appendConsultingRecord(customer: MarketingCustomer) {
    this.router.navigate(['../cc-customers/_consulting', customer.id], { relativeTo: this.activatedRoute });
  }

  /**
   * 新增跟进记录的回调
   * @param customer 客户模型
   */
  protected appendFollowRecordCallback(customer: MarketingCustomer) {
    if (!this.customersComponent) { return; }
    this.customersComponent.excelComponent.handleChangedContexts([
      { action: 'updated', context: customer }
    ]);
  }

  /**
   * 返回全部列表
   * @param e 事件
   */
  handleBackButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['../cc-customers'], { relativeTo: this.activatedRoute });
  }

  /**
   * 返回控制面板
   * @param e 事件
   */
  handleDashboardButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/dashboard']);
  }

  private _reload() {
    if (!this.customersComponent) { return; }
    const currentSchool = this.schoolMenuService.currentSchool;
    const schoolId = currentSchool && currentSchool.id !== '-1' ? currentSchool.id : null;
    const extraFilters = Object.assign(
      {},
      schoolId ? { campusId: schoolId } : {},
      { filterGroup: this.partialConfig ? this.partialConfig.name : 'old_call' }
    );
    if (schoolId) {
      this._schoolIdSubject.next(schoolId);
    }
    this.customersComponent.excelComponent.bindFilters(extraFilters).reload();
  }

}
