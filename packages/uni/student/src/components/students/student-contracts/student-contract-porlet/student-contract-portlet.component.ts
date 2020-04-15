import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {NgxExcelModelColumnRules, NgxExcelComponent, INgxExcelDataSource, NgxExcelColumnType} from 'ngx-excel';
import { ContractDto } from '@uni/contract';
import {StudentContractService} from '../../../../service/students/student-contract.service';

@Component({
  selector: 'student-contract-portlet',
  templateUrl: './student-contract-portlet.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: StudentContractService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentContractPortletComponent implements OnInit {

  rules: NgxExcelModelColumnRules<ContractDto>;

  @Input() excelComponent: NgxExcelComponent;
  @Input() context: ContractDto;
  @Output() actionButtonClick = new EventEmitter<{ action: string; contract: ContractDto }>();

  constructor(
    protected contractService: StudentContractService
  ) { }

  ngOnInit() {
    this.rules = this.contractService.getRules();
    this.rules['instalmentFee'] = { label: '分期手续费', columnType: NgxExcelColumnType.Text, prop: 'instalment_fee', optional: true,
      resolveValue: (o: any, model: ContractDto) => this.context.instalment? this.context.instalment.instalmentFee : ''};
  }
  /**
   * 导航到客户详情
   * @param e 事件
   * @param action 动作
   * @param marketingCustomer 客户信息
   */
  navigateTo(e: Event, action: string, contract: ContractDto) {
    e.preventDefault();
    e.stopPropagation();
    this.actionButtonClick.emit({ action, contract });
  }
  getContractProductNames(context: ContractDto) {
    if (context.relativeProducts.length === 0) {
      return '';
    }
    return context.relativeProducts.map((product) => product.name + '（' + product.curriculumCount + '）').join(', ');
  }
}
