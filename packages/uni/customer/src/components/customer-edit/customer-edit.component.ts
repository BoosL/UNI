import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { NgxExcelModelColumnRules, INgxExcelDataSource, NgxExcelComponentService } from 'ngx-excel';
import {
  SchoolMenuService,
  School
} from '@uni/core';
import { MarketingCustomer, MarketingCustomerCcrn } from '../../models/marketing-customer.model';
import { MarketingCustomerService } from '../../services/marketing-customer/marketing-customer.service';
import { CustomerVisitedRecord } from '../../models/customer-visited-record.model';
import { CustomerVisitedRecordService } from '../../services/customer-visited-record.service';
import { MarketingCustomerEditComponentService } from './marketing-customer-edit-component.service';
import { Subscription, of, Observable, Subject } from 'rxjs';
import { mergeMap, tap, delay, switchMap, map } from 'rxjs/operators';
import { utc } from 'moment';

@Component({
  selector: 'customer-edit',
  templateUrl: './customer-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerService },
    { provide: NgxExcelComponentService, useClass: MarketingCustomerEditComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerEditComponent implements OnInit, OnDestroy {

  rules: NgxExcelModelColumnRules<MarketingCustomer>;
  loading: boolean;
  context: MarketingCustomer;
  ccrnInfo: Partial<MarketingCustomer>;
  record: CustomerVisitedRecord;
  cantEditContactType: boolean;
  cantEditSchool: boolean;
  customer$: Observable<MarketingCustomer>;
  ccrn$: Observable<MarketingCustomerCcrn>;
  scheme: string;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _customerSubject = new Subject<MarketingCustomer>();

  @HostBinding('class.panel-step') @Input() isPanel: boolean;
  @Input() customer: MarketingCustomer;
  @Output() customerCancel = new EventEmitter<MarketingCustomer>();

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected componentService: NgxExcelComponentService,
    protected customerService: MarketingCustomerService,
    protected customerVisitedRecordService: CustomerVisitedRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerService.getRules();
    this.scheme = this.customerService.getScheme();
    this.customer$ = this._customerSubject.asObservable();
    this.ccrn$ = (this.componentService as MarketingCustomerEditComponentService).ccrnCurrentConfig$.pipe(
      tap(() => this.ccrnInfo = {
        school: this.context.school,
        hasDeposit: this.context.hasDeposit,
        cc: this.context.cc,
        cd: this.context.cd
      })
    );
    this.message.loading('数据加载中，请稍候...', { nzDuration: 0 });

    const customer = this.customer || this.customerService.createModel();
    customer.contactType = null;
    customer.relativeFirstSource = null;
    customer.relativeSecondSource = null;
    customer.relativeThirdSource = null;
    customer.relativeSourceEmployee = null;
    customer.remarkSource = '';
    customer.remark = '';
    const initialSubscription = of(null).pipe(
      mergeMap(() => this.customerService.getContactTypeForeignModels(customer)),
      tap((contactTypes) => {
        if (contactTypes.length === 1) {
          customer.contactType = contactTypes[0];
        }
        this.cantEditContactType = contactTypes.length <= 1;
      }),
      mergeMap(() => this.customerService.getSchoolForeignModels()),
      tap((schools) => {
        if (!customer.school) {
          const currentSchool = this.schoolMenuService.currentSchool;
          if (currentSchool && currentSchool.id !== '-1') {
            customer.school = currentSchool as School;
          } else if (schools.length === 1) {
            customer.school = schools[0];
          }
        } else {
          const matchedSchool = schools.find((school) => school.id === customer.school.id);
          if (matchedSchool && matchedSchool.id !== '-1') {
            customer.school = matchedSchool;
          } else if (schools.length === 1) {
            customer.school = schools[0];
          }
        }
        this.cantEditSchool = schools.length <= 1;
      })
    ).subscribe(() => {
      this.context = customer;
      this._customerSubject.next(customer);
      this.record = this.customerVisitedRecordService.createModel();
      this.record.visitorCount = 1;
      this.record.visitedTime = utc().local().format('YYYY-MM-DD HH:mm');
      this.record.relativeMarketingCustomer = this.context;
      this.cdr.detectChanges();
      this.message.remove();
    }, (e) => {
      this.message.remove();
      this.message.error(e.message || '系统错误，请联系管理员');
    });
    this._componentSubscription.add(initialSubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  handleCustomerBasicChange(customer: MarketingCustomer) {
    Object.assign(this.context, customer);
  }

  cancel(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.customerCancel.emit(null);
  }

  /**
   * 当确认按钮被点击时执行
   * @param e 事件
   */
  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    of(null).pipe(
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      delay(200),
      map(() => Object.assign(
        {}, this.context, this.ccrnInfo,
        { contact_type: this.context.contactType ? this.context.contactType.id : '' },
        { source_id: this.context.relativeThirdSource ? this.context.relativeThirdSource.id : '' },
        this.scheme === 'US' ? {
          visited_at: this.record.visitedTime,
          visitors: this.record.visitorCount,
          visit_remark: this.record.remark,
          visit_type: this.record.visitType ? this.record.visitType['value'] : ''
        } : {}
      )),
      switchMap((payload) => this.customerService.save(payload))
    ).subscribe(() => {
      this.message.success('当前操作成功，即将返回客户列表！');
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }, ({ message }) => {
      this.message.error(message || '系统错误，请联系管理员');
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

}
