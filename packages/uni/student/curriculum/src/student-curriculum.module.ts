import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TextMaskModule } from 'angular2-text-mask';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import { CurriculumModule } from '@uni/curriculum';
import { CurriculumManagerService } from './services/curriculum-manager.service';
import {
  CurriculumManagerComponent,
  CurriculumBlockExtraDiscountComponent,
  CurriculumBlockExtraContractComponent,
  CurriculumBlockExtraBillComponent,
  CurriculumBlockExtraComponent,
  CurriculumBlockPurchaseFormComponent,
  CurriculumBlockPurchaseComponent,
  CurriculumBlockSwapCountComponent,
  CurriculumBlockSwapNoComponent,
  CurriculumFlowPurchaseComponent,
  CurriculumFlowSwapComponent
} from './components/components';

@NgModule({
  declarations: [
    CurriculumManagerComponent,
    CurriculumBlockExtraDiscountComponent,
    CurriculumBlockExtraContractComponent,
    CurriculumBlockExtraBillComponent,
    CurriculumBlockExtraComponent,
    CurriculumBlockPurchaseFormComponent,
    CurriculumBlockPurchaseComponent,
    CurriculumBlockSwapCountComponent,
    CurriculumBlockSwapNoComponent,
    CurriculumFlowPurchaseComponent,
    CurriculumFlowSwapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgZorroAntdModule,
    TextMaskModule,
    PerfectScrollbarModule,
    NgxExcelModule,
    BackendSharedModule,
    CurriculumModule
  ],
  exports: [
    CurriculumManagerComponent,
    CurriculumFlowPurchaseComponent,
    CurriculumFlowSwapComponent,
  ],
  providers: [
    CurriculumManagerService
  ],
  entryComponents: [
    CurriculumManagerComponent,
    CurriculumBlockExtraDiscountComponent,
    CurriculumBlockExtraContractComponent,
    CurriculumBlockExtraBillComponent,
    CurriculumBlockExtraComponent,
    CurriculumBlockPurchaseFormComponent,
    CurriculumBlockPurchaseComponent,
    CurriculumBlockSwapCountComponent,
    CurriculumBlockSwapNoComponent,
    CurriculumFlowPurchaseComponent,
    CurriculumFlowSwapComponent
  ]
})
export class StudentCurriculumModule { }
