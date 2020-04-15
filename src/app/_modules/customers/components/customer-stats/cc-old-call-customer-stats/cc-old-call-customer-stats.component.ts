import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { BaseCustomerStatsComponent } from '../base-customer-stats-component';
import { CustomerStatsService } from '@uni/customer';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'cc-old-call-customer-stats.customer-stats.cc-customer-stats',
  templateUrl: './cc-old-call-customer-stats.component.html',
  providers: [ CustomerStatsService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcOldCallCustomerStatsComponent extends BaseCustomerStatsComponent {


  @Input() schoolId$: Observable<string>;

  protected allowDictionaryNames = [
    'successfulMonthlyAppointmentCount', 'todayOldCallCount', 'monthDialCount', 'oldCallCount',
    'successfulTodayAppointmentCount'
  ];

  constructor(
    protected cdr: ChangeDetectorRef,
    protected statsService: CustomerStatsService
  ) {
    super(cdr);
  }

  /**
   * @inheritdoc
   */
  protected getDictionaryStream() {
    return this.schoolId$.pipe(
      filter((schoolId) => !!schoolId),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((schoolId) => this.statsService.reload({ campus_id: schoolId }))
    );
  }

}
