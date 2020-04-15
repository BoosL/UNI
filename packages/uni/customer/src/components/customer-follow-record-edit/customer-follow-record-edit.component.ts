import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelModelColumnRules, NgxExcelComponentService } from 'ngx-excel';
import { CustomerFollowRecord} from '../../models/customer-follow-record.model';
import { CustomerFollowRecordService} from '../../services/customer-follow-record.service';
import { MarketingCustomerService} from '../../services/marketing-customer/marketing-customer.service';
import { CustomerFollowRecordEditComponentService } from './customer-follow-record-edit-component.service';
import { of } from 'rxjs';
import { tap, delay, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'customer-follow-record-edit',
  templateUrl: './customer-follow-record-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerFollowRecordService },
    { provide: NgxExcelComponentService, useClass: CustomerFollowRecordEditComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFollowRecordEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CustomerFollowRecord>;
  loading = false;
  message: string;

  @Input() record: CustomerFollowRecord;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawerRef: NzDrawerRef,
    protected customerService: MarketingCustomerService,
    protected customerFollowRecordService: CustomerFollowRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerFollowRecordService.getRules();
    this.rules.nextFollowBeginTime.label = '下次跟进时间';
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => {
        const payload = Object.assign({}, this.record);
        // tslint:disable: no-string-literal
        payload['action'] = 'normal';
        payload['customerId'] = this.record.relativeMarketingCustomer.id;
        payload['recordIds'] = this.record.attachments ? this.record.attachments.map((attachment) => attachment.url) : [];
        delete payload['attachments'];
        return payload;
      }),
      switchMap((payload) => this.customerFollowRecordService.save(payload)),
      switchMap(() => this.customerService.getModel(this.record.relativeMarketingCustomer.id))
    ).subscribe(
      (record) => {
        this.drawerRef.close(record);
      },
      ({ message }) => {
        this.loading = false;
        this.message = message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  dismiss(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.drawerRef.close();
  }

  /**
   * 当放弃按钮被点击时执行
   * @param e 事件
   */
  handleAbandonButtonClick(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.drawerRef.close('abandon');
  }

}
