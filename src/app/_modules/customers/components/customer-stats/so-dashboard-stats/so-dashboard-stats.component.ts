import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BaseCustomerStatsComponent } from '../base-customer-stats-component';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'so-dashboard-stats.dashboard-stats.so-dashboard-stats',
  templateUrl: './so-dashboard-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoDashboardStatsComponent extends BaseCustomerStatsComponent {

  @Input() dictionary$: Observable<{ [name: string]: string | number }>;

  protected allowDictionaryNames = [
    'new_customers_count', 'valid_customers_count', 'visited_customers_count', 'signed_customers_count'
  ];

  /**
   * @inheritdoc
   */
  protected getDictionaryStream() {
    return (this.dictionary$ || of({}));
  }

}
