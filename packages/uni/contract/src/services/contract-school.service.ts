import {Injectable} from '@angular/core';
import {BaseService, BackendService, BaseSchoolService} from '@uni/core';
import {BankAccount} from '../models/bank-account.model';
import {BankAccountService} from './bank-account.service';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ContractSchool} from '../models/contract-school.model';

@Injectable({providedIn: 'root'})
export class ContractSchoolService extends BaseSchoolService<ContractSchool> {
  protected resourceUri = 'finance/available_schools';
  protected resourceName = 'available_schools';
  protected cachedBankAccounts: { [schoolId: string]: BankAccount[] } = {};
  protected columnPrefix = 'bankAccount_';

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected bankAccountService: BankAccountService
  ) {
    super(httpClient, backendService);
  }

  /**
   * 获得校区的账户列表
   * @param model 校区模型
   */
  public getBankAccounts(model: ContractSchool | string): Observable<BankAccount[]> {
    const primaryKey = typeof (model) === 'string' ? model : model.id;
    return this.cachedBankAccounts[primaryKey] ?
      of(this.cachedBankAccounts[primaryKey]) :
      this.bankAccountService.getList({ school_id: primaryKey }).pipe(
        tap((bankAccounts: BankAccount[]) => {
          this.cachedBankAccounts[primaryKey] = bankAccounts;
        })
      );
  }
  /**
   * 获得动态列前缀
   */
  public getDynamicColumnPrefix(): string {
    return this.columnPrefix;
  }

}
