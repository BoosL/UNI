import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input, Output, ChangeDetectorRef, AfterViewInit, EventEmitter
} from '@angular/core';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { CustomerConsultingRecordModel } from '../../models/customer-consulting-record.model';
import { CustomerConsultingRecordService} from '../../services/customer-consulting-record.service';
import {INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules, NgxExcelContextComponent} from 'ngx-excel';
import {CustomerConsultingRecordComponentService} from './customer-consulting-record-component.service';

@Component({
  selector: 'customer-consulting-record',
  templateUrl: './customer-consulting-record.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerConsultingRecordService },
    { provide: NgxExcelComponentService, useClass: CustomerConsultingRecordComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerConsultingRecordComponent implements OnInit, AfterViewInit {
  isCourse = false;
  offerPriceStatus = false;
  isInvalidation = false;
  // tslint:disable: variable-name
  @Input() consultingRecord: CustomerConsultingRecordModel;
  @Input() rules: NgxExcelModelColumnRules<CustomerConsultingRecordModel>;
  @Input() customer: MarketingCustomer;
  @Input() attachSelectTo: NgxExcelContextComponent;
  @Output() handleConsultingRecordChange = new EventEmitter<CustomerConsultingRecordModel>(null);
  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
  public handleChange($event) {
    if (this.consultingRecord) {
      this.isCourse = this.consultingRecord.course;
      this.offerPriceStatus = this.consultingRecord.offerPriceStatus;
      // tslint:disable: no-string-literal
      this.isInvalidation = this.consultingRecord['isInvalidation'];
      this.changeDetectorRef.detectChanges();
    }
    this.handleConsultingRecordChange.emit($event);
  }
}
