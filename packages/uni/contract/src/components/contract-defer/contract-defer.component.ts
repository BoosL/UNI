import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';
import {
  INgxExcelDataSource,
  NgxExcelComponentService,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import {ContractDeferredRecord} from '../../models/contract-deferred-record.model';
import {  ContractDeferredRecordService} from '../../services/contract-deferred-record.service';
import {ContractDto} from '../../models/contract-dto.model';
import { Subscription, of } from 'rxjs';
import { map, delay, tap, mergeMap } from 'rxjs/operators';
import {ContractDeferComponentService} from './contract-defer-component.service';


@Component({
  selector: 'contract-defer',
  templateUrl: './contract-defer.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: ContractDeferredRecordService },
    { provide: NgxExcelComponentService, useClass: ContractDeferComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractDeferComponent implements OnInit {

  componentValue: ContractDeferredRecord;
  rules: NgxExcelModelColumnRules<ContractDeferredRecord>;
  loading = false;
  message = '';

  protected subscription = new Subscription();
  @Input() contract: ContractDto;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected drawRef: NzDrawerRef<ContractDeferredRecord>,
    protected contractDeferredRecordService: ContractDeferredRecordService
  ) { }

  ngOnInit() {
    this.rules = this.contractDeferredRecordService.getRules();
    this.componentValue = this.contractDeferredRecordService.createModel();
    this.componentValue.type = this.contractDeferredRecordService.getTypes().find((selectOption) => selectOption.value === '1');
    this.componentValue.productEndTime = this.contract.productEndTime ?  this.contract.productEndTime : '';
  }
  /**
   * 当表单提交时执行
   */
  confirm() {
    of(null).pipe(
      delay(200),
      map(() => ({
        type: this.componentValue.type,
        month: this.componentValue.month,
        remark: this.componentValue.remark,
        attachments: this.componentValue.attachments
      })),
      tap(() => {
        this.loading = true;
        this.cdr.detectChanges();
      }),
      mergeMap((payload) => this.contractDeferredRecordService.save(
        Object.assign(payload, { studentId: this.contract.relativeStudent.id, contractId: this.contract.id })
      ))
    ).subscribe(
      (studentDeferContract) => this.drawRef.close(studentDeferContract),
      (e) => {
        this.loading = false;
        this.message = e.message || '系统错误,请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  dismiss() {
    this.drawRef.close();
  }

}
