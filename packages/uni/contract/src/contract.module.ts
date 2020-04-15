import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatRippleModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import {ContractsComponent} from './components/contracts/contracts.component';
import {ContractsSearchComponent} from './components/contracts-search/contracts-search.component';
import {ContractDeferComponent} from './components/contract-defer/contract-defer.component';
import {ContractBasicComponent} from './components/contract-basic/contract-basic.component';
import {ContractComponent} from './components/contract/contract.component';
import {ContractSubjectsComponent} from './components/contract-subjects/contract-subjects.component';

@NgModule({
  declarations: [
    ContractsComponent,
    ContractComponent,
    ContractBasicComponent,
    ContractDeferComponent,
    ContractsSearchComponent,
    ContractSubjectsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgZorroAntdModule,
    NgxExcelModule,
    BackendSharedModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    ContractsComponent
  ],
  entryComponents: [
    ContractComponent,
    ContractBasicComponent,
    ContractDeferComponent,
    ContractsSearchComponent,
    ContractSubjectsComponent
  ]
})
export class ContractModule { }
