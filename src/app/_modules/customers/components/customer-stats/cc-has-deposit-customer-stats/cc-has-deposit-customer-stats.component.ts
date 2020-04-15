import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { BaseCustomerStatsComponent } from '../base-customer-stats-component';
import { CustomerStatsService } from '@uni/customer';
import { Observable } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'cc-has-deposit-customer-stats.customer-stats.cc-customer-stats',
  templateUrl: './cc-has-deposit-customer-stats.component.html',
  providers: [ CustomerStatsService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcHasDepositCustomerStatsComponent extends BaseCustomerStatsComponent {

  @Input() schoolId$: Observable<string>;

  protected allowDictionaryNames = [
    'signingCustomerCount', 'successfulVisitCustomerCount', 'monthSuccessfulVisitCustomerCount', 'depositCount',
    'successfulMonthlySigningCustomerCount', 'monthDepositCount', 'depositMonthlyTotalSum'
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
