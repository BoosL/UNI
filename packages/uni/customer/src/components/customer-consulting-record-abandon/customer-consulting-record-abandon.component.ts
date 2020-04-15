import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { NgxExcelModelColumnRules, INgxExcelDataSource } from 'ngx-excel';
import { CustomerConsultingRecordModel } from '../../models/customer-consulting-record.model';
import { CustomerConsultingRecordService} from '../../services/customer-consulting-record.service';
import { of } from 'rxjs';
import { tap, delay, map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'customer-consulting-record-abandon',
  templateUrl: './customer-consulting-record-abandon.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerConsultingRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerConsultingRecordAbandonComponent implements OnInit {

  rules: NgxExcelModelColumnRules<CustomerConsultingRecordModel>;
  loading = false;
  message: string;
  @Input() record: CustomerConsultingRecordModel;
  constructor(
    protected cdr: ChangeDetectorRef,
    protected modalRef: NzModalRef,
    protected customerConsultingRecordService: CustomerConsultingRecordService
  ) { }

  ngOnInit() {
    this.rules = this.customerConsultingRecordService.getRules();
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
        action: 'no_consult',
        no_consultation_remark: this.record.reasonForAbandoning,
        customer_id: this.record.relativeMarketingCustomer.id
      })),
      switchMap((payload) => this.customerConsultingRecordService.save(payload))
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
