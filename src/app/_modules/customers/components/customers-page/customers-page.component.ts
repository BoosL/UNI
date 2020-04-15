import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  forwardRef,
  Type,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  BACKEND_PAGE,
} from '@uni/core';
import {
  MarketingCustomer,
  CustomersComponent,
  CustomersSearch,
  CustomersSearchService
} from '@uni/customer';
import { BaseCustomerWrapperComponent } from '../base-customer-wrapper-component';
import { SoCustomersSearchComponent, UsCustomersSearchComponent, CcCustomersSearchComponent } from '../customers-search/customers-search';
import { Subscription } from 'rxjs';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'backend-page.customers',
  templateUrl: './customers-page.component.html',
  providers: [
    CustomersSearchService,
    { provide: BACKEND_PAGE, useExisting: forwardRef(() => CustomersPageComponent) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersPageComponent extends BaseCustomerWrapperComponent implements OnInit, OnDestroy, AfterViewInit {

  // tslint:disable: variable-name
  private _searchConditions: CustomersSearch;
  private _componentSubscription = new Subscription();

  @ViewChild(CustomersComponent, { static: false }) customersComponent: CustomersComponent;

  ngOnInit() {
    this.initSchemeConfig();
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const reloadSubscription = this.schoolMenuService.currentSchool$.pipe(
      filter((school) => !!school),
      map((school) => school && school.id !== '-1' ? school.id : null),
      distinctUntilChanged(),
    ).subscribe(
      () => this._reloadCustomers()
    );
    this._componentSubscription.add(reloadSubscription);
  }

  /**
   * 当新增客户按钮被点击时执行
   * @param e 事件
   */
  handleAddButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.handleActionButtonClick({ action: 'create', marketingCustomer: null });
  }

  /**
   * 当客户到访按钮被点击时执行
   * @param e 事件
   */
  handleAppendVisitedRecordButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.handleActionButtonClick({ action: 'appendVisitedRecordModal', marketingCustomer: null });
  }

  /**
   * 当客户搜索按钮被点击时执行
   * @param e 事件
   */
  handleSearchButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    let componentType: Type<any> = null;
    if (this.schemeConfig.name === 'SO') {
      componentType = SoCustomersSearchComponent;
    } else if (this.schemeConfig.name === 'US') {
      componentType = UsCustomersSearchComponent;
    } else if (this.schemeConfig.name === 'CC') {
      componentType = CcCustomersSearchComponent;
    }
    if (componentType === null) { return; }

    this.modal.create({
      nzWidth: '75%',
      nzBodyStyle: { padding: '0' },
      nzContent: componentType,
      nzComponentParams: { context: this._searchConditions }
    }).afterClose.subscribe((searchConditions) => {
      // 返回 undefined 代表直接关闭
      if (searchConditions === undefined) { return; }
      this._searchConditions = searchConditions;
      this._reloadCustomers();
    });
  }

  /**
   * 放弃客户跟进的回调
   * @param _ 客户模型
   */
  protected abandonCallback(_: MarketingCustomer) {
    this._searchConditions = null;
    this._reloadCustomers();
  }

  /**
   * 新增到访记录的回调
   * @param customer 客户模型
   */
  protected appendVisitedRecordCallback(customer: MarketingCustomer) {
    if (!this.customersComponent) { return; }
    this.customersComponent.excelComponent.handleChangedContexts([
      { action: 'updated', context: customer }
    ]);
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
   * 重新加载客户列表
   */
  private _reloadCustomers() {
    if (!this.customersComponent) { return; }
    const currentSchool = this.schoolMenuService.currentSchool;
    const schoolId = currentSchool && currentSchool.id !== '-1' ? currentSchool.id : null;
    const extraFilters = Object.assign(
      {},
      schoolId ? { campusId: schoolId } : {},
      this._searchConditions ? this.searchService.getConditions(this._searchConditions) : {}
    );
    this.customersComponent.excelComponent.bindFilters(extraFilters).reload();
  }

}
