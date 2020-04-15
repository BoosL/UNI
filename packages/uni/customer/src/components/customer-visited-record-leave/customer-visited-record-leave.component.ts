import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { INgxExcelDataSource, NgxExcelModelColumnRules } from 'ngx-excel';
import { TodayVisitedRecord } from '../../models/today-visited-record.model';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { TodayVisitedRecordService } from '../../services/today-visited-record.service';
import { of } from 'rxjs';
import { tap, delay, map, switchMap } from 'rxjs/operators';
// import { utc } from 'moment';

@Component({
  selector: 'customer-visited-record-leave',
  templateUrl: './customer-visited-record-leave.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: TodayVisitedRecordService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerVisitedRecordLeaveComponent implements OnInit {

  record: TodayVisitedRecord;
  rules: NgxExcelModelColumnRules<TodayVisitedRecord>;
  message: string;
  loading: boolean;

  @Input() customer: MarketingCustomer;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected modalRef: NzModalRef,
    protected dataService: TodayVisitedRecordService
  ) { }

  ngOnInit() {
    this.rules = this.dataService.getRules();
    this.record = this.dataService.createModel();
    this.record.relativeMarketingCustomer = this.customer;
    // this.record.leaveTime = utc().local().format('YYYY-MM-DD HH:mm');
  }

  /**
   * 关闭弹窗
   * @param e 事件
   */
  dismiss(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close();
  }

  /**
   * 录入确认时执行
   * @param e 事件
   */
  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => {
        const payload = Object.assign({}, this.record);
        // tslint:disable: no-string-literal
        payload['leaveTime'] = this.record.leaveTime;
        return payload;
      }),
      switchMap((payload) => this.dataService.save(payload, this.record.relativeMarketingCustomer.id))
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
