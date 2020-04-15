import {Injectable} from '@angular/core';
import {NgxExcelComponentService} from 'ngx-excel';
import {map, mergeMap} from 'rxjs/operators';
import {pascalCase} from 'change-case';
import {ContractRechargeService} from '../../services/contract-recharge.service';
import {ContractDtoService} from '../../services/contract-dto.service';
import {ContractRecharge} from '../../models/contract-recharge.model';
import {of} from 'rxjs';

@Injectable()
export class ContractComponentService extends NgxExcelComponentService {
  protected columnPrefix = '';

  constructor(
    protected contractService: ContractDtoService,
    protected rechargeService: ContractRechargeService,
  ) {
    super();
  }

  /**
   * 初始话可编辑函数
   */
  public initCanEdit(extendsRules) {
    this.columnPrefix = this.contractService.getDynamicColumnPrefix();
    for (const item of extendsRules) {
      const columnName = item.name || '';
      if (columnName.indexOf(this.columnPrefix) !== -1) {
        // 给类原型链动态加方法
        // tslint:disable:max-line-length
        ContractComponentService.prototype['handle' + pascalCase(columnName) + 'Change'] = (originalModel: ContractRecharge, model: ContractRecharge, name: string) => {
          return this.rechargeService.getSchoolBankAccounts().pipe(
            map((accounts) => {
              const changedBankAccountId = name.replace('bankAccount_', '');
              const detail = {};
              accounts.forEach((account) => {
                detail[account.id] = (account.id === changedBankAccountId ? model[name] : model.bankAccountsDetail[account.id]) || '0.0000';
              });
              model.bankAccountsDetail = detail;
              if (!model.isInstalment) {
                model.instalmentFee = '0.0000';
              }
              const totalReceipts = Object.values(model.bankAccountsDetail).reduce((previous, current) => (parseFloat(previous) + parseFloat(current)).toFixed(4));
              model.totalReceipts = (parseFloat(totalReceipts) + parseFloat(model.useCap)).toFixed(4);
              return [{ action: 'updated', context: Object.assign({}, model) }];
            })
          );
        };
      }
    }
  }

  public handleUseCapChange(originalModel: ContractRecharge, model: ContractRecharge) {
    const totalReceipts = Object.values(model.bankAccountsDetail).reduce((previous, current) => (parseFloat(previous) + parseFloat(current)).toFixed(4));
    model.totalReceipts = (parseFloat(totalReceipts) + parseFloat(model.useCap)).toFixed(4);
    return of([{ action: 'updated', context: Object.assign({}, model) }]);
  }
  public handleIsInstalmentChange(originalModel: ContractRecharge, model: ContractRecharge) {
    model.instalmentFee = '0.00';
    return of([{ action: 'updated', context: Object.assign({}, model) }]);
  }

  protected canEditInstalmentFee(model: ContractRecharge, name: string): boolean {
    return model && model.isInstalment;
  }
}
