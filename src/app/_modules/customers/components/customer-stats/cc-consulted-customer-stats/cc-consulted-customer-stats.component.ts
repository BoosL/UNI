import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { BaseCustomerStatsComponent } from '../base-customer-stats-component';
import { CustomerStatsService } from '@uni/customer';
import { Observable } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'cc-consulted-customer-stats.customer-stats.cc-customer-stats',
  templateUrl: './cc-consulted-customer-stats.component.html',
  providers: [ CustomerStatsService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcConsultedCustomerStatsComponent extends BaseCustomerStatsComponent {

  @Input() schoolId$: Observable<string>;

  protected allowDictionaryNames = [
    'signingCustomerCount', 'consultCustomerCount',
    'successfulMonthlySigningCustomerCount', 'monthDepositCount',
    'monthConsultCustomerCount', 'successfulMonthlyTotalSum'
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
