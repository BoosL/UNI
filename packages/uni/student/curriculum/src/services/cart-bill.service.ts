import { HttpClient } from '@angular/common/http';
import { BaseService, BackendService, BankService, BankInstalmentService, Bank, BankInstalment } from '@uni/core';
import { NgxExcelModelColumnRules, NgxExcelColumnType, NgxExcelService } from 'ngx-excel';
import { CartBill } from '../models/cart.model';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export class CartBillService extends BaseService<CartBill> {

  protected resourceUri = 'students/{student_id}/carts/{cart_id}/bills';
  protected resourceName = 'bills';
  protected rules = {
    id: {
      label: '账单主键', columnType: NgxExcelColumnType.PrimaryKey
    },
    amount: {
      label: '账单金额', columnType: NgxExcelColumnType.Currency
    },
    instalmentMode: {
      label: '分期方式', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getInstalmentModes(), default: this.getInstalmentModes()[0]
    },
    bank: {
      label: '分期银行', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.bankService as NgxExcelService<Bank>, labelKey: 'name',
      disableCache: true
    },
    instalment: {
      label: '分期期数', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.instalmentService as NgxExcelService<BankInstalment>, labelKey: 'name',
      disableCache: true
    },
    instalmentFee: {
      label: '分期手续费', columnType: NgxExcelColumnType.Currency, optional: true
    },
    receivableMoney: {
      label: '应收金额', columnType: NgxExcelColumnType.Currency
    }
  } as NgxExcelModelColumnRules<CartBill>;

  // tslint:disable-next-line: variable-name
  private _cachedBankInstalmentsMap: {
    [name: string]: {
      bank: Bank,
      instalments: BankInstalment[]
    }
  } = {};

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected bankService: BankService,
    protected instalmentService: BankInstalmentService
  ) {
    super(httpClient, backendService);
  }

  /**
   * 获得所有可用的分期方式
   */
  public getInstalmentModes() {
    return [
      { label: '不分期', value: '0' },
      { label: '首付分期', value: '1' },
      // { label: '全额分期', value: '2' }
    ];
  }

  /**
   * 判断账单是否分期账单
   * @param model 待判断的账单
   */
  public isInstalmentBill(model: CartBill) {
    return (model && model.instalmentMode) ? model.instalmentMode.value !== '0' : false;
  }

  /**
   * 获得账单的分期银行
   */
  public getBankForeignModels(): Observable<Bank[]> {
    if (Object.values(this._cachedBankInstalmentsMap).length > 0) {
      return of(Object.values(this._cachedBankInstalmentsMap).map((mapValue) => mapValue.bank));
    }

    return this.bankService.getList(null).pipe(
      tap((banks: Bank[]) => banks.forEach(
        (bank) => this._cachedBankInstalmentsMap[bank.id] = { bank, instalments: [] })
      ),
      map(() => Object.values(this._cachedBankInstalmentsMap).map((mapValue) => mapValue.bank))
    );
  }

  /**
   * 获得银行的分期期数配置
   * @param model 账单模型
   */
  public getInstalmentForeignModels(model: CartBill): Observable<BankInstalment[]> {
    if (!model.bank) { return of([]); }

    const mapKey = model.bank.id;
    if (!this._cachedBankInstalmentsMap[mapKey]) { return of([]); }
    if (this._cachedBankInstalmentsMap[mapKey].instalments.length > 0) {
      return of(this._cachedBankInstalmentsMap[mapKey].instalments);
    }

    return this.instalmentService.getList({ bankId: mapKey }).pipe(
      tap((instalments) => this._cachedBankInstalmentsMap[mapKey].instalments = instalments),
      map(() => this._cachedBankInstalmentsMap[mapKey].instalments)
    );
  }

}
