import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Optional
} from '@angular/core';
import { NzDrawerRef, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelContextComponent } from 'ngx-excel';
import {
  SchoolMenuService,
  School
} from '@uni/core';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { CustomerVisitedRecord } from '../../models/customer-visited-record.model';
import { MarketingCustomerService} from '../../services/marketing-customer/marketing-customer.service';
import { MarketingCustomerStatelessService} from '../../services/marketing-customer/marketing-customer-stateless.service';
import { CustomerVisitedRecordService} from '../../services/customer-visited-record.service';
import { Subscription, of } from 'rxjs';
import { tap, delay, map, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { utc } from 'moment';

@Component({
  selector: 'customer-visited-record-edit',
  templateUrl: './customer-visited-record-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerVisitedRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerVisitedRecordEditComponent implements OnInit, OnDestroy {

  rules: NgxExcelModelColumnRules<CustomerVisitedRecord>;
  loading = false;
  message = '';
  searchPhone = '';
  searching: boolean;

  // tslint:disable-next-line: variable-name
  private _componentSubscription = new Subscription();

  @Input() componentMode: 'simple' | 'portlet' | 'section';
  @Input() record: CustomerVisitedRecord;
  @Input() attachSelectTo: NgxExcelContextComponent;
  @Output() recordChange = new EventEmitter<CustomerVisitedRecord>();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected messageService: NzMessageService,
    protected schoolMenuService: SchoolMenuService,
    protected customerService: MarketingCustomerService,
    protected customerStatelessService: MarketingCustomerStatelessService,
    protected customerVisitedRecordService: CustomerVisitedRecordService,
    @Optional() public modalRef: NzModalRef,
    @Optional() public drawerRef: NzDrawerRef,
  ) { }

  ngOnInit() {
    this.rules = this.customerVisitedRecordService.getRules();
    this.record = this._rebuildCustomerVisitedRecord(this.record);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  /**
   * 当输入的手机号码发生变化时执行
   */
  handleSearchPhoneChange() {
    this.record.relativeMarketingCustomer = null;
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
      switchMap((mobile: string) => this.customerStatelessService.getList({ mobile }, 1, 1)),
    ).subscribe(
      (marketingCustomers: MarketingCustomer[]) => {
        const marketingCustomer = marketingCustomers.length > 0 ? marketingCustomers[0] : null;
        if (!marketingCustomer) {
          this.messageService.warning('没有找到相应的客户信息，请检查手机号码是否输入正确！');
        }
        this.searching = false;
        this.record.relativeMarketingCustomer = marketingCustomer;
        this.record = this._rebuildCustomerVisitedRecord(this.record);
        this.cdr.detectChanges();
      },
      ({ message }) => {
        this.messageService.error(message || '系统错误，请联系管理员');
        this.searching = false;
        this.cdr.detectChanges();
      }
    );
  }

  confirm(event) {
    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => {
        const payload = Object.assign({}, this.record);
        // tslint:disable: no-string-literal
        payload['customerId'] = this.record.relativeMarketingCustomer.id;
        payload['campusId'] = this.schoolMenuService.currentSchool.id;
        return payload;
      }),
      switchMap((payload) => this.customerVisitedRecordService.save(payload))
    ).subscribe(
      (record) => {
        if (this.modalRef) {
          this.modalRef.close(record);
        }
        if (this.drawerRef) {
          this.drawerRef.close(record);
        }
      },
      ({ message }) => {
        this.loading = false;
        this.message = message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  dismiss(event) {
    if (this.modalRef) {
      this.modalRef.close();
    }
    if (this.drawerRef) {
      this.drawerRef.close();
    }
  }

  handleContextChange(e: CustomerVisitedRecord) {
    this.recordChange.emit(e);
  }

  /**
   * 格式化到访记录
   * @param record 原记录
   */
  private _rebuildCustomerVisitedRecord(record?: CustomerVisitedRecord) {
    record = record || this.customerVisitedRecordService.createModel();
    record.visitorCount = 1;
    if (record.relativeMarketingCustomer) {
      record.relativeMarketingCustomer.school = this.schoolMenuService.currentSchool as School;
      record.cc = record.relativeMarketingCustomer.cc;
    }
    if (!record.visitedTime) {
      record.visitedTime = utc().local().format('YYYY-MM-DD HH:mm');
    }
    if (!record.visitorCount) {
      record.visitorCount = 1;
    }
    return record;
  }

}
