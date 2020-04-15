import { Injectable } from '@angular/core';
import { NgxExcelComponentService } from 'ngx-excel';
import { MarketingCustomer, MarketingCustomerCcrn} from '../../models/marketing-customer.model';
import { of } from 'rxjs';

@Injectable()
export class MarketingCustomerEditCcrnComponentService extends NgxExcelComponentService {

  // tslint:disable-next-line: variable-name
  private _ccrn: MarketingCustomerCcrn[];

  /**
   * 绑定 Ccrn 配置规则
   * @param ccrn 当前的配置规则
   */
  public bindCcrnConfig(ccrn: MarketingCustomerCcrn[]) {
    this._ccrn = ccrn;
    const componentConfig = {
      invisibleDeposit: true,
      cantEditDeposit: true,
      invisibleCc: true,
      cantEditCc: true,
      invisibleCd: true,
      cantEditCd: true
    };
    const defaultValue = {
      hasDeposit: false,
      nextStep: ''
    };
    const depositValues = this._ccrn.map((rule) => rule.depositConfig);
    if (
      (depositValues.indexOf('any') >= 0) ||
      (depositValues.indexOf('true') >= 0 && depositValues.indexOf('false') >= 0)
    ) {
      // 选择是否收订金，且可以变更
      componentConfig.invisibleDeposit = false;
      componentConfig.cantEditDeposit = false;
    } else if (depositValues.indexOf('true') >= 0) {
      // 不能选择是否收订金，不可变更，固定值为 true
      componentConfig.invisibleDeposit = false;
      componentConfig.cantEditDeposit = true;
      defaultValue.hasDeposit = true;
    } else if (depositValues.indexOf('false') >= 0) {
      // 不能选择是否收订金，不可变更，固定值为 false
      componentConfig.invisibleDeposit = false;
      componentConfig.cantEditDeposit = true;
      defaultValue.hasDeposit = false;
    } else {
      // 不能选择是否收订金
      componentConfig.invisibleDeposit = true;
      componentConfig.cantEditDeposit = true;
      defaultValue.hasDeposit = false;
    }

    const matchedRules = this._ccrn.filter((rule) => {
      if (rule.depositConfig === 'null') { return true; }
      return rule.depositConfig === (defaultValue.hasDeposit ? 'true' : 'false') || rule.depositConfig === 'any';
    });
    defaultValue.nextStep = matchedRules.length === 1 ? matchedRules[0].nextStepConfig : '';

    const nextStepValues = this._ccrn.map((rule) => rule.nextStepConfig);
    componentConfig.invisibleCc = nextStepValues.indexOf('to_cc') < 0;
    componentConfig.invisibleCd = nextStepValues.indexOf('to_cd') < 0;

    componentConfig.cantEditCc = componentConfig.invisibleCc ? true : !this.canEditCc(defaultValue);
    componentConfig.cantEditCd = componentConfig.invisibleCd ? true : !this.canEditCd(defaultValue);

    return { componentConfig, defaultValue };
  }

  /**
   * 根据当前的配置情况决定是否可以编辑CC
   * @param model 当前模型
   */
  public canEditCc(model: Partial<MarketingCustomer>) {
    const deposit = model.hasDeposit ? 'true' : 'false';
    const matchedRule = this._ccrn.find((rule) => {
      if (rule.depositConfig === 'null') { return true; }
      return rule.depositConfig === deposit || rule.depositConfig === 'any';
    });
    return matchedRule ? matchedRule.nextStepConfig === 'to_cc' : false;
  }

  /**
   * 根据当前的配置情况决定是否可以编辑CD
   * @param model 当前模型
   */
  public canEditCd(model: Partial<MarketingCustomer>) {
    const deposit = model.hasDeposit ? 'true' : 'false';
    const matchedRule = this._ccrn.find((rule) => {
      if (rule.depositConfig === 'null') { return true; }
      return rule.depositConfig === deposit || rule.depositConfig === 'any';
    });
    return matchedRule ? matchedRule.nextStepConfig === 'to_cd' : false;
  }

  /**
   * 当是否收订金发生变化时执行
   * @param _ 原模型
   * @param currentModel 现模型
   */
  public handleHasDepositChange(_: Partial<MarketingCustomer>, currentModel: Partial<MarketingCustomer>) {
    const deposit = currentModel.hasDeposit ? 'true' : 'false';
    const matchedRule = this._ccrn.find((rule) => {
      if (rule.depositConfig === 'null') { return true; }
      return rule.depositConfig === deposit || rule.depositConfig === 'any';
    });
    // tslint:disable-next-line: no-string-literal
    currentModel['nextStep'] = matchedRule ? matchedRule.nextStepConfig : '';
    return of([{ action: 'updated', context: Object.assign({}, currentModel) }]);
  }

}
