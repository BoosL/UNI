import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService, BackendService} from '@uni/core';
import {NgxExcelModelColumnRules, NgxExcelColumnType} from 'ngx-excel';
import {BankAccount} from '../models/bank-account.model';
import {ContractSchoolService} from './contract-school.service';
import {ContractDto} from '../models/contract-dto.model';
import {ContractRecharge} from '../models/contract-recharge.model';
import {Observable} from 'rxjs';
import {Enums} from './enums';
import {ContractSchool} from '../models/contract-school.model';

@Injectable()
export class ContractRechargeService extends BaseService<ContractRecharge> {

  protected resourceUri = '';
  protected resourceName = 'contract_recharge_records';
  protected rules = {
    id: { label: '临时主键', columnType: NgxExcelColumnType.PrimaryKey },
    type: {
      label: '合同类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Contract.ContractType)
    },
    isInstalment: { label: '分期账单？', columnType: NgxExcelColumnType.Bool },
    instalmentFee: { label: '分期手续费', columnType: NgxExcelColumnType.Currency, allowNegative: true },
    downPayment: { label: '首付金额', columnType: NgxExcelColumnType.Currency, allowNegative: true },
    instalmentAmount: { label: '分期金额', columnType: NgxExcelColumnType.Currency, allowNegative: true },
    serverAmount: { label: '分期服务费', columnType: NgxExcelColumnType.Currency, allowNegative: true },
    bankAccountsDetail: {
      label: '银行收入明细',
      columnType: NgxExcelColumnType.Array,
      resolveValue: (o: any) => this.resolveBankAccountsDetail(o)
    },
    useCap: { label: '其他', columnType: NgxExcelColumnType.Currency },
    contractAmount: { label: '应收总额', columnType: NgxExcelColumnType.Currency },
    totalReceipts: { label: '实收总额', columnType: NgxExcelColumnType.Currency }
  } as NgxExcelModelColumnRules<ContractRecharge>;
  protected relativeContract: ContractDto;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected schoolService: ContractSchoolService
  ) {
    super(httpClient, backendService);
  }

  protected resolveBankAccountsDetail(o: any) {
    // tslint:disable: no-string-literal
    if (!o['bank_accounts_detail'] || !Array.isArray(o['bank_accounts_detail'])) {
      return {};
    }
    const detail = {};
    Array.from(o['bank_accounts_detail']).forEach((item) => detail[item['bank_account_id']] = item['receipts']);
    return detail;
  }

  protected resolve(o: any) {
    const model = super.resolve(o);
    Object.keys(model.bankAccountsDetail).forEach((accountId) => {
      model['bankAccount_' + accountId] = model.bankAccountsDetail[accountId];
    });
    return model;
  }

  /**
   * @inheritdoc
   */
  protected resolveBody(data: { [name: string]: any }): { [name: string]: any } {
    // tslint:disable: no-string-literal
    const detail = data['bankAccountsDetail'];
    delete data['bankAccountsDetail'];
    const body = super.resolveBody(data);
    if (detail) {
      body['bank_accounts_detail'] = Object.keys(detail).map((item) => {
        return { bank_account_id: item, receipts: detail[item] };
      });
    }
    return body;
  }

  /**
   * 获得记录值
   */
  public getValue(context: ContractRecharge) {
    if (!context) {
      return;
    }
    // tslint:disable: no-string-literal
    context['contract_id'] = this.relativeContract.id;
    context['school_id'] = this.relativeContract.relativeSchool.id;
    delete context['id'];
    delete context['totalReceipts'];
    delete context['type'];
    return this.resolveBody(context);
  }

  /**
   * 获得关联合同所属校区的银行账户列表
   * @param school 校区
   */
  public getSchoolBankAccounts(): Observable<BankAccount[]> {
    return this.schoolService.getBankAccounts(this.relativeContract.relativeSchool as ContractSchool);
  }

  public getRelativeContract(contract: ContractDto, columnRules: any): ContractRecharge {
    this.relativeContract = contract;
    const context = this.createModel({
      contractAmount: contract.unpaidAmount,
      type: contract.type,
      isInstalment: contract.isInstalment,
      downPayment: contract.downPayment,
      instalmentFee: contract.instalment ? contract.instalment.instalmentFee : '',
      instalmentAmount: contract.instalment ? contract.instalment.instalmentAmount : '',
      serverAmount: contract.serverAmount || '',
      bankAccountsDetail: {}
    });
    columnRules.forEach((account) => {
      context[account.name] = '0.00';
      context.bankAccountsDetail[account.id] = '0.00';
    });
    return context;
  }
}
