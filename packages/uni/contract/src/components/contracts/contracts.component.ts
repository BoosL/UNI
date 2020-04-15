import {Component, AfterViewInit, Input, ViewChild, OnInit, Output, EventEmitter} from '@angular/core';
import {
  INgxExcelDataSource, NgxExcelComponent, NgxExcelComponentService
} from 'ngx-excel';
import {ContractDto} from '../../models/contract-dto.model';
import {ContractDtoService} from '../../services/contract-dto.service';
import {ContractComponentService} from './contract-component.service';

@Component({
  selector: 'contracts',
  templateUrl: './contracts.component.html',
  providers: [
    { provide: INgxExcelDataSource, useExisting: ContractDtoService },
    { provide: NgxExcelComponentService, useClass: ContractComponentService }
  ]
})

export class ContractsComponent  {
  // tslint:disable: variable-name
  @Input() sourceType = 'finance';
  @Input() portletTpl: any;
  @Input() schemeConfig: { name: string, height: number };
  @Output() handleContractRecharge = new EventEmitter<ContractDto>();
  @Output() handleContractDefer = new EventEmitter<ContractDto>();
  @ViewChild(NgxExcelComponent, { static: false }) public excelComponent: NgxExcelComponent;

  constructor(
    protected excel: ContractDtoService,
  ) {
  }
  // 合同
  public handleMenuRecharge = ({ context }) => {
    if (!context || !context.id) {
      return;
    }
    this.handleContractRecharge.emit(context);
  }
  // 合同延期
  deferContract = ({ context }: { context: ContractDto }) => {
    this.handleContractDefer.emit(context);
    /*const drawerRef = this.drawer.create<ContractDeferComponent, {
      contract: Contract,
    }, Contract>({
      nzWidth: '30%',
      nzBodyStyle: { height: '100%', overflow: 'auto', padding: '0 0 54px 0' },
      nzContent: ContractDeferComponent,
      nzContentParams: { contract: context }
    });
    return drawerRef.afterClose.pipe(
      filter((stduentContract) => !!stduentContract),
      map((stduentContract) => [{ action: 'append', context: stduentContract }])
    );*/
  }
}
