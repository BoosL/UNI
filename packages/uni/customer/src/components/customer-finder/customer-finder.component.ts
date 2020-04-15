import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  HostBinding,
  Input
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService, NzDrawerService } from 'ng-zorro-antd';
import {
  CustomerVisitedRecordService
} from '../../services/customer-visited-record.service';
import {MarketingCustomer} from '../../models/marketing-customer.model';
import {
  MarketingCustomerStatelessService,
  MarketingCustomerService
} from '../../services/marketing-customer/marketing-customer';
import { INgxExcelDataSource, NgxExcelModelColumnRules } from 'ngx-excel';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'customer-finder',
  templateUrl: './customer-finder.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerStatelessService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFinderComponent implements OnInit, OnDestroy, AfterViewInit {

  searchPhone = '';
  searching: boolean;
  rules: NgxExcelModelColumnRules<MarketingCustomer>;
  matchedCustomer: MarketingCustomer;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();

  @Input() schemeConfig: { [name: string]: any };
  @Input() portletTpl: any;
  @Output() actionButtonClick = new EventEmitter<any>();
  @HostBinding('class.panel-step') @Input() isPanel: boolean;

  constructor(
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    protected message: NzMessageService,
    protected drawer: NzDrawerService,
    protected customerService: MarketingCustomerService,
    protected customerStatelessService: MarketingCustomerStatelessService,
    protected customerVisitedRecordService: CustomerVisitedRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerStatelessService.getRules();
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() { }

  /**
   * 当动作被点击时执行
   * @param e 动作
   */
  handleActionButtonClick(e: any) {
    this.actionButtonClick.emit(e);
  }

  /**
   * 当输入的手机号码发生变化时执行
   */
  handleSearchPhoneChange() {
    this.matchedCustomer = null;
  }

  /**
   * 当输入的手机号码被提交时执行
   * @param e 事件
   */
  handleSearchPhoneConfirm(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    if (this.searchPhone.length === 0) { return; }
    of(this.searchPhone).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.cdr.detectChanges();
      }),
      switchMap((mobile: string) => this.customerStatelessService.getList({ mobile }, 1, 1))
    ).subscribe((matchedCustomers: MarketingCustomer[]) => {
      if (matchedCustomers === null) {
        this.searching = false;
        this.cdr.detectChanges();
        return;
      }
      this.matchedCustomer = matchedCustomers.length > 0 ? matchedCustomers[0] : null;
      if (this.matchedCustomer) {
        this.searching = false;
        this.cdr.detectChanges();
      } else {
        const customer = this.customerStatelessService.createModel();
        customer.phone = this.searchPhone;
        this.actionButtonClick.emit({ action: 'edit', marketingCustomer: customer });
      }
    }, (e) => {
      this.message.error(e.message || '系统错误，请联系管理员');
      this.searching = false;
      this.cdr.detectChanges();
    });
  }

}
