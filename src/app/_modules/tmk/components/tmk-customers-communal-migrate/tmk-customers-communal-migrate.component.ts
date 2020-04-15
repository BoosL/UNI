import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { NgxExcelModelColumnRules, INgxExcelDataSource } from 'ngx-excel';
import { Observable, of } from 'rxjs';
import { tap, delay, map, switchMap } from 'rxjs/operators';
import { TmkCustomersMigrateService } from '../../services/tmk-customers-migrate.service';
import { TmkCustomer } from '../../models/tmk-customer.model';
import { TmkCustomersMigrate } from '../../models/tmk-customers-migrate.model';

@Component({
  selector: 'tmk-customers-communal-migrate',
  templateUrl: './tmk-customers-communal-migrate.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: TmkCustomersMigrateService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomersCommunalMigrateComponent implements OnInit {

  rules: NgxExcelModelColumnRules<TmkCustomersMigrate>;
  loading = false;
  message: string;
  record: TmkCustomersMigrate;
  canEditCount = false;

  // tslint:disable: variable-name
  private _extraFilters: any;
  @Input() customers: TmkCustomer[];
  @Input() extraFilters$: Observable<any>;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected modalRef: NzModalRef,
    protected customersMigrateService: TmkCustomersMigrateService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.record = this.customersMigrateService.createModel();
    this.rules = this.customersMigrateService.getRules();
    this.extraFilters$.subscribe((extraFilters) => {
      this._extraFilters = extraFilters;
      if (this.customers.length > 0 && this.customers.length) {
        this.canEditCount = true;
        this.record.count = JSON.stringify(this.customers.length);
      } else if (!this.customers.length) {
        this.canEditCount = false;
      }
    });
  }

  dismiss(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close();
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    of(null).pipe(
      tap(() => this.loading = true),
      delay(200),
      map(() => {
        return this._getConfirmData();
      }),
      switchMap((payload) => this.customersMigrateService.save(payload))
    ).subscribe(
      (context) => {
        this.modalRef.close(null);
      },
      ({ message }) => {
        this.loading = false;
        this.message = message || '系统错误，请联系管理员';
        this.cdr.markForCheck();
      }
    );
  }

  /*
  * 组装数据
  * */
  private _getConfirmData() {
    const params = {
      action: 'resource_assigned',
      target_tmk: this.record.targetTmk ? this.record.targetTmk.id : '',
      params: this._extraFilters,
      count: ''
    };
    if (this.customers && this.customers.length > 0) {
      // tslint:disable-next-line: no-string-literal
      params['customers'] = [];
      for (const item of this.customers) {
        // tslint:disable-next-line: no-string-literal
        params['customers'].push(item.id);
      }
    } else {
      params.params = this._extraFilters;
      params.count = this.record.count;
    }
    return params;
  }

}
