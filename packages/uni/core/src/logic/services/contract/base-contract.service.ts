import { HttpClient } from '@angular/common/http';
import { NgxExcelColumnType, NgxExcelModelColumnRules } from 'ngx-excel';
import { BaseContract} from '../../models/contract.model';
import { SelectOption } from '../../../models/models';
import { BaseService } from '../../../services/base.service';
import { BackendService } from '../../../services/backend.service';
import { Enums } from '../../enums';

export abstract class BaseContractService<T extends BaseContract> extends BaseService<T> {

  protected rules = {
    id: { label: '合同主键', columnType: NgxExcelColumnType.PrimaryKey },
    sn: {
      label: '合同编号', columnType: NgxExcelColumnType.Text,
      prop: 'number'
    },
    amount: {label: '应收金额', columnType: NgxExcelColumnType.Currency },
    actualAmount: {
      label: '实收金额', columnType: NgxExcelColumnType.Currency,
      prop: 'receivable_amount'
    },
    beginTime: {
      label: '开始时间', columnType: NgxExcelColumnType.Date,
      prop: 'start_at'
    },
    endTime: {
      label: '结束时间', columnType: NgxExcelColumnType.Date,
      prop: 'end_at'
    },
    givenTime: { label: '免费续期月数', columnType: NgxExcelColumnType.Number },
    type: {
      label: '合同类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Contract.ContractType),
    },
    createdTime: {
      label: '入库时间', columnType: NgxExcelColumnType.DateTime,
      prop: 'created_at'
    },
    productType: {
      label: '产品类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Product.Type)
    },
    status: {
      label: '合同状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Contract.ContractStatus)
    }
  } as NgxExcelModelColumnRules<T>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
  ) {
    super(httpClient, backendService);
  }
  public getContractTypes(): SelectOption[] {
    return this.getSelectOptions(Enums.Contract.ContractType);
  }
  /* NewPurchase 新购*/
  public getNewPurchaseContractType(): SelectOption {
    return this.getSelectOptions(Enums.Contract.ContractType).find( (type) => type.value === '1');
  }
  /* ContinuousPurchase 复购*/
  public getContinuousPurchaseContractType(): SelectOption {
    return this.getSelectOptions(Enums.Contract.ContractType).find( (type) => type.value === '2');
  }
  /* Exchange 跨产品换课*/
  public getExchangeContractType(): SelectOption {
    return this.getSelectOptions(Enums.Contract.ContractType).find( (type) => type.value === '3');
  }
  /*  Translation 平移*/
  public getTranslationContractType(): SelectOption {
    return this.getSelectOptions(Enums.Contract.ContractType).find( (type) => type.value === '4');
  }
  /* Refund 退课*/
  public getRefundContractType(): SelectOption {
    return this.getSelectOptions(Enums.Contract.ContractType).find( (type) => type.value === '5');
  }
  /* SchoolTransform 转校*/
  public getSchoolTransformContractType(): SelectOption {
    return this.getSelectOptions(Enums.Contract.ContractType).find( (type) => type.value === '6');
  }
  /*  Swap 同产品换课*/
  public getSwapContractType(): SelectOption {
    return this.getSelectOptions(Enums.Contract.ContractType).find( (type) => type.value === '7');
  }
  /*  InstalmentFee 分期服务费*/
  public getInstalmentFeeContractType(): SelectOption {
    return this.getSelectOptions(Enums.Contract.ContractType).find( (type) => type.value === '20');
  }

}
