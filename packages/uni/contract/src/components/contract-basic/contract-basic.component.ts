import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import {  NgxExcelModelColumnRules, INgxExcelDataSource} from 'ngx-excel';
import {ContractDto} from '../../models/contract-dto.model';
import {ContractDtoService} from '../../services/contract-dto.service';

@Component({
  selector: 'contract-basic',
  templateUrl: './contract-basic.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: ContractDtoService },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractBasicComponent implements  OnInit {
  public rules: NgxExcelModelColumnRules<ContractDto>;
  @Input() contract: ContractDto;
  constructor(
    protected contractService: ContractDtoService,
  ) {
  }
  ngOnInit(): void {
    this.rules = this.contractService.getRules();
    // tslint:disable: no-string-literal
    this.rules['relativeStudentCC'] = this.rules.relativeStudent.relativeService.getRules().cc;
    this.rules['relativeStudentSC'] = this.rules.relativeStudent.relativeService.getRules().sc;
    this.rules['relativeSource'] = this.rules.customer.relativeService.getRules().relativeSource;
    this.rules['tmk'] = this.rules.customer.relativeService.getRules().tmk;
    this.rules['instalmentBankName'] = this.rules.instalment.relativeService.getRules().instalmentBankName;
    this.rules['instalmentNum'] = this.rules.instalment.relativeService.getRules().instalmentNum;
    this.rules['instalmentFee'] = this.rules.instalment.relativeService.getRules().instalmentFee;
  }
}
