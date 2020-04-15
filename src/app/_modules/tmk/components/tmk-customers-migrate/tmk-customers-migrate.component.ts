import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import {NgxExcelModelColumnRules, INgxExcelDataSource, NgxExcelColumnType, NgxExcelComponentService} from 'ngx-excel';
import { Observable, of } from 'rxjs';
import { tap, delay, map, switchMap } from 'rxjs/operators';
import { TmkCustomersMigrateService } from '../../services/tmk-customers-migrate.service';
import { TmkCustomer } from '../../models/tmk-customer.model';
import { TmkCustomersMigrate } from '../../models/tmk-customers-migrate.model';
import {TmkCustomersMigrateComponentService} from './tmk-customers-migrate-component.service';

@Component({
  selector: 'tmk-customers-migrate',
  templateUrl: './tmk-customers-migrate.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: TmkCustomersMigrateService },
    { provide: NgxExcelComponentService, useClass: TmkCustomersMigrateComponentService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmkCustomersMigrateComponent implements OnInit {

  rules: NgxExcelModelColumnRules<TmkCustomersMigrate>;
  loading = false;
  message: string;
  record: TmkCustomersMigrate;

  // tslint:disable: variable-name
  private _extraFilters: any;
  @Input() customers: TmkCustomer[];
  @Input() extraFilters$: Observable<any>;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected modalRef: NzModalRef,
    protected customersMigrateService: TmkCustomersMigrateService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected componentService: NgxExcelComponentService
  ) {
  }

  ngOnInit() {
    this.record = this.customersMigrateService.createModel({
      migrateCount: (this.customers && this.customers.length > 0) ? this.customers.length.toString() : ''
    } );
    this.rules = this.customersMigrateService.getRules();
    this.extraFilters$.subscribe((extraFilters) => {
      this._extraFilters = extraFilters;
      (this.componentService as TmkCustomersMigrateComponentService).setExtraFilter(this._extraFilters);
    });

  }

  dismiss(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close();
  }

  getCustomerTmk() {
    // tslint:disable: variable-name
    const _tmkNames = [];
    const _tmkIds = [];
    for (const item of this.customers) {
      if (_tmkIds.indexOf(item.tmk.id) < 0) {
        _tmkIds.push(item.tmk.id);
        _tmkNames.push(item.tmk.name);
      }
    }
    const _length = _tmkNames.length
    const str = _length > 3 ? _tmkNames.splice(0, 3).join(',') + '...等' + _length + '人' : _tmkNames.join('，');
    return str;
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
      action: 'resource_transferred',
      from_tmk: '',
      target_tmk: this.record.targetTmk ? this.record.targetTmk.id : '',
      params: this._extraFilters,
    };
    if (this.customers && this.customers.length > 0) {
      // tslint:disable-next-line: no-string-literal
      params['customers'] = [];
      for (const item of this.customers) {
        // tslint:disable-next-line: no-string-literal
        params['customers'].push(item.id);
      }
    } else {
      params.from_tmk = this.record.fromTmk ? this.record.fromTmk.id : '';
      params.params = this._extraFilters;
    }

    return params;
  }

}
