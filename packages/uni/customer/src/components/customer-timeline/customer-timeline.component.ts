import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import {CustomerTimelineService} from '../../services/customer-timeline.service';
import {MarketingCustomer} from '../../models/marketing-customer.model';
import {CustomerTimeline} from '../../models/customer-timeline.model';
import { Observable, Subscription } from 'rxjs';
import { filter, distinctUntilChanged, delay } from 'rxjs/operators';

@Component({
  selector: 'customer-timeline',
  templateUrl: './customer-timeline.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: CustomerTimelineService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerTimelineComponent implements OnInit, OnDestroy, AfterViewInit {

  fakeTitle: string;

  // tslint:disable-next-line: variable-name
  private _componentSubscription = new Subscription();

  @Input() customer$: Observable<MarketingCustomer>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const reloadSubscription = this.customer$.pipe(
      filter((customer) => !!customer),
      distinctUntilChanged((o1, o2) => o1.id === o2.id),
      delay(200), // 为了等待前端刷新需要手动延迟 200ms
    ).subscribe(
      (customer) => this.excelComponent.bindFilters({ customerId: customer.id }).reload()
    );
    this._componentSubscription.add(reloadSubscription);
  }

  getTitle(context: CustomerTimeline) {
    if (context.type.value === 'cc_followed') {
      return context.ccFollowRecord && context.ccFollowRecord.reasonForAbandoning ? 'CC放弃跟进' : context.type.label;
    }
    if (context.type.value === 'cc_consult') {
      return context.ccConsultingRecord && context.ccConsultingRecord.reasonForAbandoning ? 'CC客户未咨' : context.type.label;
    }
    return context.type.label;
  }

  calculateTimelineHeight = (context: CustomerTimeline) => {
    switch (context.type.value) {
      case 'customer_add':
        return 252;
      case 'tmk_followed':
        return 290;
      case 'visited':
        return 290;
      case 'cc_followed':
        // 容错处理
        if (!context.ccFollowRecord) { return 132; }
        // 放弃跟进
        if (context.ccFollowRecord.reasonForAbandoning) { return 210; }
        // 邀约失败
        if (context.ccFollowRecord.inviteFailedReason) { return 640; }
        // 正常跟进
        return 520;
      case 'cc_consult':
        // 容错处理
        if (!context.ccConsultingRecord) { return 132; }
        // 未咨
        if (context.ccConsultingRecord.reasonForAbandoning) { return 210; }
        let height = 330;
        // 咨询废turn
        if (context.ccConsultingRecord.invalidationReason) {
          height = 690;
        }
        // 咨询是否推荐课程
        if (context.ccConsultingRecord.course) {
          height += 40;
        }
        return height;
      default:
        return 132;
    }
  }

}
