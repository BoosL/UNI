import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import {NzDrawerRef, NzMessageService} from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules, } from 'ngx-excel';
import { of } from 'rxjs';
import { tap, delay, map, switchMap } from 'rxjs/operators';
import { TmkCustomerFollowRecordService } from '../../services/tmk-customer-follow-record.service';
import { TmkCustomerFollowRecord } from '../../models/tmk-customer-follow-record.model';
import { TmkCustomersService } from '../../services/tmk-customers.service';
import { TmkCustomerFollowRecordEditComponentService } from './tmk-customer-follow-record-edit-component.service';
import {TmkCustomer} from '../../models/tmk-customer.model';
@Component({
  selector: 'tmk-customer-follow-record-edit',
  templateUrl: './tmk-customer-follow-record-edit.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: TmkCustomerFollowRecordService },
    { provide: NgxExcelComponentService, useClass: TmkCustomerFollowRecordEditComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomerFollowRecordEditComponent implements OnInit {

  rules: NgxExcelModelColumnRules<TmkCustomerFollowRecord>;
  loading = false;
  message: string;

  @Input() record: TmkCustomerFollowRecord;
  @Output() handleFollowSuccess = new EventEmitter();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected customerService: TmkCustomersService,
    protected messageService: NzMessageService,
    protected customerFollowRecordService: TmkCustomerFollowRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerFollowRecordService.getRules();
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
        payload['action_code'] = this.record.actionCode.id;
        payload['customerId'] = this.record.relativeMarketingCustomer.id;
        return payload;
      }),
      switchMap((payload) => this.customerFollowRecordService.save(payload)),
    ).subscribe(
      (record) => {
        this.handleFollowSuccess.emit();
        this.loading = false;
        this.message = '';
        this.messageService.success('客户跟进成功！');
        this._resetRecord();
      },
      ({ message }) => {
        this.loading = false;
        this.message = message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }
  private _resetRecord() {
    const customer: TmkCustomer = Object.assign({}, this.record.relativeMarketingCustomer);
    this.record = this.customerFollowRecordService.createModel();
    this.record.relativeMarketingCustomer = customer;
    this.cdr.detectChanges();
  }


}
