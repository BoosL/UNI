import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { NgxExcelModelColumnRules, INgxExcelDataSource } from 'ngx-excel';
import { CustomerFollowRecord} from '../../models/customer-follow-record.model';
import { CustomerFollowRecordService} from '../../services/customer-follow-record.service';
import { of } from 'rxjs';
import { tap, delay, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'customer-follow-record-abandon',
  templateUrl: './customer-follow-record-abandon.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerFollowRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFollowRecordAbandonComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CustomerFollowRecord>;
  loading = false;
  message: string;

  @Input() record: CustomerFollowRecord;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected modalRef: NzModalRef,
    protected customerFollowRecordService: CustomerFollowRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerFollowRecordService.getRules();
  }

  dismiss(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close();
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => ({
        action: 'abandon',
        reasonForAbandoning: this.record.reasonForAbandoning,
        customerId: this.record.relativeMarketingCustomer.id
      })),
      switchMap((payload) => this.customerFollowRecordService.save(payload))
    ).subscribe(
      (record) => {
        this.modalRef.close(record);
      },
      ({ message }) => {
        this.loading = false;
        this.message = message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

}
