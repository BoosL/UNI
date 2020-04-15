import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatRippleModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule } from '@angular/material';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxExcelModule } from 'ngx-excel';
import { BackendSharedModule } from '@uni/core';
import { CustomerModule } from '@uni/customer';
import {
  CustomerConsultingRecordPageComponent
} from './components/customer-consulting-record-page/customer-consulting-record-page.component';
import {
  SoCustomerPortletComponent,
  UsCustomerPortletComponent,
  CcCustomerPortletComponent
} from './components/customer-portlet/customer-portlet';
import {
  SoCustomersSearchComponent,
  UsCustomersSearchComponent,
  CcCustomersSearchComponent
} from './components/customers-search/customers-search';
import {
  SoDashboardStatsComponent,
  CcOldCallCustomerStatsComponent,
  CcConsultedCustomerStatsComponent,
  CcHasDepositCustomerStatsComponent
} from './components/customer-stats/customer-stats';

import {
  SoDashboardComponent,
  UsDashboardComponent,
  CcDashboardComponent,
  MarketingDashboardComponent
} from './components/dashboard/dashboard';


import { PartialCustomersPageComponent } from './components/partial-customers-page/partial-customers-page.component';
import { CustomersPageComponent } from './components/customers-page/customers-page.component';

import { CustomerEditPageComponent } from './components/customer-edit-page/customer-edit-page.component';
import { CustomerPageComponent } from './components/customer-page/customer-page.component';

import { CustomerImportPageComponent } from './components/customer-import-page/customer-import-page.component';
import { CustomerImportUploadComponent } from './components/customer-import-upload/customer-import-upload.component';



@NgModule({
  declarations: [
    SoCustomerPortletComponent,
    UsCustomerPortletComponent,
    CcCustomerPortletComponent,
    SoCustomersSearchComponent,
    UsCustomersSearchComponent,
    CcCustomersSearchComponent,
    SoDashboardStatsComponent,
    CcOldCallCustomerStatsComponent,
    CcConsultedCustomerStatsComponent,
    CcHasDepositCustomerStatsComponent,
    CustomersPageComponent,
    PartialCustomersPageComponent,
    CustomerConsultingRecordPageComponent,
    SoDashboardComponent,
    UsDashboardComponent,
    CcDashboardComponent,
    MarketingDashboardComponent,

    CustomerPageComponent,
    CustomerEditPageComponent,
    CustomerImportPageComponent,
    CustomerImportUploadComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    NgxExcelModule,
    CustomerModule,
    BackendSharedModule,
    MatRippleModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MarketingDashboardComponent,
    CustomersPageComponent,
    PartialCustomersPageComponent,
    CustomerPageComponent,
    CustomerEditPageComponent,
    CustomerConsultingRecordPageComponent,
    CustomerImportPageComponent,
  ],
  entryComponents: [
    SoCustomersSearchComponent,
    UsCustomersSearchComponent,
    CcCustomersSearchComponent,
    SoCustomerPortletComponent,
    UsCustomerPortletComponent,
    CcCustomerPortletComponent,
  ],
})
export class CustomersModule { }
