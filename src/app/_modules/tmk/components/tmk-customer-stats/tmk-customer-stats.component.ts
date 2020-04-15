import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter, AfterViewInit
} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {TmkCustomerStatsService} from '../../services/tmk-customer-stats.service';
import {TmkCustomerStats} from '../../models/tmk-customer-stats.model';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';


@Component({
  selector: 'tmk-customer-stats.tmk-customer-stats',
  templateUrl: './tmk-customer-stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomerStatsComponent implements OnInit, OnDestroy {
  tag: string;
  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _tmkStats: TmkCustomerStats;
  private _subordinateStaffId: string;
  @Input() extraFilters$: Observable<any>;
  @Input() migrateSuccess$: Observable<boolean>;
  @Output() handleTagsChange = new EventEmitter<string>();

  constructor(
    protected cdr: ChangeDetectorRef,
    protected statsService: TmkCustomerStatsService,
  ) {
  }

  ngOnInit() {
    const dictionarySubscription = this.extraFilters$.pipe(
      map((extraFilters) => {
        // tslint:disable: no-string-literal
        this.tag = extraFilters['groupFilter'] ? extraFilters['groupFilter'] : '';
        this.cdr.detectChanges();
        return extraFilters['subordinate_staff_id'] ? extraFilters['subordinate_staff_id'] : '';
      }),
      distinctUntilChanged(),
    ).subscribe((subordinateStaffId) => {
      if (!subordinateStaffId) {
        return;
      }
      this._subordinateStaffId = subordinateStaffId;
      this._reloadComponent();
    });
    this.migrateSuccess$.subscribe( (bool) => {
      if (bool) {
        this._reloadComponent();
      }
    });
    this._componentSubscription.add(dictionarySubscription);
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  private _reloadComponent() {
    this.statsService.getModel(this._subordinateStaffId).subscribe((stats: TmkCustomerStats) => {
      this._tmkStats = stats;
      this.cdr.detectChanges();
    });
  }

  public handleClickTag(type: string) {
    this.handleTagsChange.emit(type);
  }

  public num(str: string, type: string) {
    if (!this._tmkStats) {
      return '0';
    }
    return this._tmkStats[str] && this._tmkStats[str][type] ? this._tmkStats[str][type] : '0';
  }

}
