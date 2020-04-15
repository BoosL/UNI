import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {INgxExcelDataSource, NgxExcelComponentService, NgxExcelModelColumnRules} from 'ngx-excel';
import { NzModalRef } from 'ng-zorro-antd';
import {ContractSearchService} from '../../services/contract-search.service';
import {ContractSearch} from '../../models/contract-search.model';
@Component({
  selector: 'contracts-search.contracts-search',
  templateUrl: './contracts-search.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: ContractSearchService }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractsSearchComponent implements OnInit {
  rules: NgxExcelModelColumnRules<ContractSearch>;
  @Input() context: ContractSearch;
  constructor(
    protected modalRef: NzModalRef,
    protected contractSearchService: ContractSearchService
  ) {
  }
  ngOnInit() {
    this.rules = this.contractSearchService.getRules();
    this.context = this.context || this.contractSearchService.createModel() as ContractSearch;
  }
  reset(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    this.modalRef.close(null);
  }

  confirm(e: Event) {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => this.modalRef.close(this.context), 200);
  }
}
