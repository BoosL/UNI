import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MarketingCustomer } from '../../models/marketing-customer.model';
import { Observable, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, distinctUntilChanged, delay, tap } from 'rxjs/operators';
import { INgxExcelDataSource, NgxExcelComponent } from 'ngx-excel';
import { MarketingCustomerVersionService } from '../../services/marketing-customer/marketing-customer-version.service';

@Component({
  selector: 'customer-versions',
  templateUrl: './customer-versions.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: MarketingCustomerVersionService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerVersionsComponent implements OnInit, OnDestroy, AfterViewInit {

  scope$: Observable<'source' | 'campus' | 'identity' | 'learning_purpose'>;

  // tslint:disable: variable-name
  private _componentSubscription = new Subscription();
  private _scopeChangeSubject = new BehaviorSubject<'source' | 'campus' | 'identity' | 'learning_purpose'>('source');

  @Input() customer$: Observable<MarketingCustomer>;
  @ViewChild(NgxExcelComponent, { static: false }) excelComponent: NgxExcelComponent;

  constructor() { }

  ngOnInit() {
    this.scope$ = this._scopeChangeSubject.asObservable();
  }

  ngOnDestroy() {
    this._componentSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    const reloadSubscription = combineLatest(this.customer$, this._scopeChangeSubject).pipe(
      map((resultSet) => ({ customerId: resultSet[0] ? resultSet[0].id : null, filter: resultSet[1] })),
      filter(({ customerId }) => !!customerId),
      distinctUntilChanged((o1, o2) => o1.customerId === o2.customerId && o1.filter === o2.filter),
      delay(200), // 为了等待前端刷新需要手动延迟 200ms
    ).subscribe(
      (payload) => this.excelComponent.bindFilters(payload).reload()
    );
    this._componentSubscription.add(reloadSubscription);
  }

  handleScopeSelect(selectedScope: 'source' | 'campus' | 'identity' | 'learning_purpose') {
    this._scopeChangeSubject.next(selectedScope);
  }

}
