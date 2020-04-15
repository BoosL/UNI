import { Renderer2, Injector, ComponentFactoryResolver, Optional, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService, NzDrawerService } from 'ng-zorro-antd';
import {
  IBackendPageComponent,
  SchoolMenuService,
} from '@uni/core';
import {
  MarketingCustomerService,
  CustomerVisitedRecordService,
  CustomerFollowRecordService,
  CustomerConsultingRecordService,
  MarketingCustomer,
  CustomerVisitedRecordEditComponent,
  CustomerVisitedRecordLeaveComponent,
  CustomerFollowRecordAbandonComponent,
  CustomerFollowRecordEditComponent,
  CustomerConsultingRecordAbandonComponent,
  CustomersSearchService,
  CustomerComponent
} from '@uni/customer';
import { of } from 'rxjs';

export abstract class BaseCustomerWrapperComponent extends IBackendPageComponent {

  schemeConfig: any;

  protected schemeSettings: { [key: string]: any } = {
    SO: { name: 'SO', height: 310, createPortletFirstTitle: '新增 Leads', createPortletSecondTitle: '已存在的客户' },
    US: { name: 'US', height: 192, createPortletFirstTitle: '新增客户', createPortletSecondTitle: '已存在的客户' },
    CC: { name: 'CC', height: 192 }
  };

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected renderer2: Renderer2,
    protected injector: Injector,
    protected cfr: ComponentFactoryResolver,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected modal: NzModalService,
    protected drawer: NzDrawerService,
    protected schoolMenuService: SchoolMenuService,
    protected customerService: MarketingCustomerService,
    protected customerVisitedRecordService: CustomerVisitedRecordService,
    protected customerFollowRecordService: CustomerFollowRecordService,
    protected customerConsultingRecordService: CustomerConsultingRecordService,
    @Optional() protected searchService: CustomersSearchService
  ) {
    super(renderer2, injector, cfr);
  }

  protected initSchemeConfig() {
    this.schemeConfig = this.schemeSettings[this.customerService.getScheme()] || this.schemeSettings.SO;
  }

  /**
   * 新增客户
   */
  protected create() {
    this.router.navigate(['./_create'], { relativeTo: this.activatedRoute });
  }

  /**
   * 跳转到客户详情
   * @param customer 当前客户
   */
  protected detail(customer: MarketingCustomer) {
    // this.router.navigate(['./', customer.id], { relativeTo: this.activatedRoute });
    if (!customer || !customer.id) { return; }
    this.drawer.create({
      nzWidth: '90%',
      nzBodyStyle: { padding: '0' },
      nzContent: CustomerComponent,
      nzContentParams: { customerId$: of(customer.id), componentMode: 'portlet' }
    }).afterClose.subscribe((context) => {
      if (context === null || context === undefined) { return; }
      if (this.schemeConfig.name === 'SO') {
        this.router.navigate(['/so-customers', context.id]);
      } else if (this.schemeConfig.name === 'US') {
        this.router.navigate(['/us-customers', context.id]);
      } else if (this.schemeConfig.name === 'CC') {
        this.router.navigate(['/cc-customers', context.id]);
      }
    });
  }

  /**
   * 跳转到客户咨询记录
   * @param customer 当前客户
   */
  protected appendConsultingRecord(customer: MarketingCustomer) {
    this.router.navigate(['./_consulting', customer.id], { relativeTo: this.activatedRoute });
  }
  /**
   * 放弃客户咨询
   * @param customer 当前客户
   */
  protected appendNotConsultingRecord(customer: MarketingCustomer) {
    const customerAbondonRecord = this.customerConsultingRecordService.createModel();
    customerAbondonRecord.relativeMarketingCustomer = customer;
    this.modal.create({
      nzWidth: 480,
      nzBodyStyle: { padding: '0' },
      nzContent: CustomerConsultingRecordAbandonComponent,
      nzComponentParams: { record: customerAbondonRecord }
    }).afterClose.subscribe((context) => {
      if (context === null || context === undefined) { return; }
      this.message.success('客户未咨描述填写成功，页面即将刷新！');
      const method = 'abandonCallback';
      if (this[method] === null || this[method] === undefined) { return; }
      this[method](context);
    });
  }

  /**
   * 放弃客户跟进
   * @param customer 当前客户
   */
  protected abandon(customer: MarketingCustomer) {
    const customerAbondonRecord = this.customerFollowRecordService.createModel();
    customerAbondonRecord.relativeMarketingCustomer = customer;
    this.modal.create({
      nzWidth: 480,
      nzBodyStyle: { padding: '0' },
      nzContent: CustomerFollowRecordAbandonComponent,
      nzComponentParams: { record: customerAbondonRecord }
    }).afterClose.subscribe((context) => {
      if (context === null || context === undefined) { return; }
      this.message.success('客户放弃跟进成功，页面即将刷新！');
      const method = 'abandonCallback';
      if (this[method] === null || this[method] === undefined) { return; }
      this[method](context);
    });
  }

  /**
   * 新增当前客户到访记录
   * @param customer 当前客户
   */
  protected appendVisitedRecord(customer: MarketingCustomer) {
    const customerVisitedRecord = this.customerVisitedRecordService.createModel();
    customerVisitedRecord.relativeMarketingCustomer = customer;
    this.drawer.create({
      nzWidth: '45%',
      nzContent: CustomerVisitedRecordEditComponent,
      nzContentParams: { record: customerVisitedRecord, componentMode: 'portlet' }
    }).afterClose.subscribe((context) => {
      if (context === null || context === undefined) { return; }
      this.message.success('新增客户到访记录成功！');
      const method = 'appendVisitedRecordCallback';
      if (this[method] === null || this[method] === undefined) { return; }
      this[method](context);
    });
  }

  /**
   * 新增客户到访记录
   * @param customer 当前客户
   */
  protected appendVisitedRecordModal(customer?: MarketingCustomer) {
    const record = this.customerVisitedRecordService.createModel();
    let componentMode: 'section' | 'portlet' = 'section';
    if (customer) {
      record.relativeMarketingCustomer = customer;
      componentMode = 'portlet';
    }
    this.modal.create({
      nzWidth: '45%',
      nzBodyStyle: { padding: '0' },
      nzContent: CustomerVisitedRecordEditComponent,
      nzComponentParams: { record, componentMode }
    }).afterClose.subscribe((context) => {
      if (context === null || context === undefined) { return; }
      this.message.success('新增客户到访记录成功！');
      const method = 'appendVisitedRecordCallback';
      if (this[method] === null || this[method] === undefined) { return; }
      this[method](context);
    });
  }

  /**
   * 新增客户到访离校记录
   * @param customer 当前客户
   */
  protected appendVisitedLeaveRecordModal(customer: MarketingCustomer) {
    this.modal.create({
      nzWidth: 360,
      nzBodyStyle: { padding: '0' },
      nzContent: CustomerVisitedRecordLeaveComponent,
      nzComponentParams: { customer }
    }).afterClose.subscribe((context) => {
      if (context === null || context === undefined) { return; }
      this.message.success('新增客户离校记录成功！');
      const method = 'appendVisitedRecordCallback';
      if (this[method] === null || this[method] === undefined) { return; }
      this[method](context);
    });
  }

  /**
   * 新增客户跟进记录
   * @param customer 当前客户
   */
  protected appendFollowRecord(customer: MarketingCustomer) {
    const customerFollowRecord = this.customerFollowRecordService.createModel();
    customerFollowRecord.relativeMarketingCustomer = customer;
    this.drawer.create({
      nzWidth: 360,
      nzBodyStyle: { padding: '0' },
      nzContent: CustomerFollowRecordEditComponent,
      nzContentParams: { record: customerFollowRecord }
    }).afterClose.subscribe((context) => {
      if (context === null || context === undefined) { return; }
      if (context === 'abandon') {
        this.handleActionButtonClick({ action: 'abandon', marketingCustomer: customer });
      } else {
        this.message.success('客户跟进成功！');
        const method = 'appendFollowRecordCallback';
        if (this[method] === null || this[method] === undefined) { return; }
        this[method](context);
      }
    });
  }

  /**
   * 当动作按钮被点击时执行
   * @param action 动作
   * @param marketingCustomer 涉及到的客户
   */
  handleActionButtonClick({ action, marketingCustomer }) {
    if (this[action] === null || this[action] === undefined) {
      this.message.error(`未定义的动作 ${action}`);
      return;
    }
    this[action](marketingCustomer);
  }

}
