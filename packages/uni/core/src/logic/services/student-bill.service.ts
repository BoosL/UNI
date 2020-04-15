import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  NgxExcelColumnType,
  NgxExcelService,
  NgxExcelModelColumnRules,
} from 'ngx-excel';
import { BaseService } from '../../services/base.service';
import { BackendService } from '../../services/backend.service';
import { Enums } from '../enums';
import { Bank, BankInstalment } from '../models/common.model';
import { Student } from '../models/student.model';
import { BaseBill } from '../models/bill.model';
import { StudentBill } from '../models/student-bill.model';
import { BankService } from './bank.service';
import { BankInstalmentService } from './bank-instalment.service';
import { StudentService } from './student.service';

export abstract class BaseBillService<T extends BaseBill> extends BaseService<T> {

  protected rules = {
    id: { label: '账单主键', columnType: NgxExcelColumnType.PrimaryKey },
    contractType: {
      label: '账单类型', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getBillTypeSelectOptions()
    },
     productType: {
      label: '产品类型',
      columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Product.Type)
    },
    amount: { label: '账单金额', columnType: NgxExcelColumnType.Currency },
    isInstalment: { label: '是否分期？', columnType: NgxExcelColumnType.Bool },
    bank: {
      label: '分期银行', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.bankService as NgxExcelService<Bank>, labelKey: 'name',
      resolveValue: (o: any, model: Partial<T>) => this.resolveBank(o, model)
    },
    instalment: {
      label: '分期期数', columnType: NgxExcelColumnType.ForeignKey,
      relativeService: this.instalmentService as NgxExcelService<BankInstalment>, labelKey: 'name',
      resolveValue: (o: any, model: Partial<T>) => this.resolveInstalment(o, model)
    },
    receivableMoney: {
      label: '待收金额', columnType: NgxExcelColumnType.Currency,
      prop: 'receivable_amount'
    },
    deadline: { label: '最后还款日', columnType: NgxExcelColumnType.Date }
  } as NgxExcelModelColumnRules<T>;

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected bankService: BankService,
    protected instalmentService: BankInstalmentService
  ) {
    super(httpClient, backendService);
  }

  protected resolveBank(o: any, model: Partial<T>) {
    return model.isInstalment && o.bank ? this.bankService.createModel(null, o.bank) : null;
  }

  protected resolveInstalment(o: any, model: Partial<T>) {
    return model.isInstalment && o.instalment ? this.instalmentService.createModel(null, o.instalment) : null;
  }

  public getBillTypeSelectOptions() {
    return this.getSelectOptions(Enums.Bill.Type);
  }

}

@Injectable()
export class StudentBillService extends BaseBillService<StudentBill> {

  protected resourceUri = 'students/{student_id}/bills';
  protected resourceName = 'bills';

  protected additionalRules = {
    paidMoney: {
      label: '已付金额', columnType: NgxExcelColumnType.Currency,
      prop: 'pay_amount'
    },
    paidTime: {
      label: '付款时间', columnType: NgxExcelColumnType.DateTime,
      prop: 'pay_at'
    },
    relativeStudent: {
      label: '所属学员', columnType: NgxExcelColumnType.ForeignKey,
      relativedService: this.studentService as NgxExcelService<Student>, labelKey: 'name',
      prop: 'student'
    },
    status: {
      label: '账单状态', columnType: NgxExcelColumnType.SelectOption,
      selectOptions: this.getSelectOptions(Enums.Bill.Status)
    }
  };

  constructor(
    protected httpClient: HttpClient,
    protected backendService: BackendService,
    protected bankService: BankService,
    protected instalmentService: BankInstalmentService,
    protected studentService: StudentService
  ) {
    super(httpClient, backendService, bankService, instalmentService);
  }

}
