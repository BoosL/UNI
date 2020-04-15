import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Renderer2,
  Injector,
  ComponentFactoryResolver,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter, Type, ComponentRef, ViewContainerRef, ChangeDetectorRef, TemplateRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService, NzDrawerService, NzModalService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponent } from 'ngx-excel';
import {
  SchoolMenuService
} from '@uni/core';
import {MarketingCustomer} from '../../models/marketing-customer.model';
import {MarketingCustomerService} from '../../services/marketing-customer/marketing-customer.service';
import {CustomerVisitedRecordService} from '../../services/customer-visited-record.service';
import {CustomerFollowRecordService} from '../../services/customer-follow-record.service';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent implements OnInit, OnDestroy, AfterViewInit {

  rules: NgxExcelModelColumnRules<MarketingCustomer>;
  // tslint:disable: variable-name
  @Input() schemeConfig: { name: string, height: number };
  @Input() portletTpl: any;

  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

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
    protected customerFollowRecordService: CustomerFollowRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerService.getRules();
  }

  ngOnDestroy() { }

  ngAfterViewInit() { }
}
