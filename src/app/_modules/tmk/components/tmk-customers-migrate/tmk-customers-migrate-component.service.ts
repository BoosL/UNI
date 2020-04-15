import {Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {map} from 'rxjs/operators';
import {TmkCustomersMigrate} from '../../models/tmk-customers-migrate.model';
import {MarketingCustomerService} from '@uni/customer';

@Injectable()
export class TmkCustomersMigrateComponentService extends NgxExcelComponentService {
  // tslint:disable: variable-name
  private _extraFilter: any;

  constructor(
    protected tmkCustomerService: MarketingCustomerService
  ) {
    super();
  }

  public setExtraFilter(extraFilter: any) {
    this._extraFilter = extraFilter;
  }

  /*
   * 转出人变更*/
  handleFromTmkChange(originalModel: TmkCustomersMigrate, model: TmkCustomersMigrate) {
    return this.tmkCustomerService.getList(
      Object.assign({}, this._extraFilter, { meta: 'total', is_transfer: true, from_tmk_id: model.fromTmk.id }), 1, 1
    ).pipe(
      map((res) => {
        const meta = this.tmkCustomerService.getResponseMetas();
        model.migrateCount = meta && meta.total ? meta.total : '';
        return [{ action: 'updated', context: model }];
      })
    );
  }
}
