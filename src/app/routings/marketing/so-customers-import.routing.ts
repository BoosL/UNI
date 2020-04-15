import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarketingCustomerService } from '@uni/customer';
import { MarketingCustomerForSourceService } from '../../../app/_modules/customers/services/marketing-customer-for-source.service';

import {
  CustomersModule,
  CustomerImportPageComponent
} from 'src/app/_modules/customers/customers';

const routes: Routes = [
  { path: '', component: CustomerImportPageComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CustomersModule
  ],
  exports: [
    RouterModule
  ],
  providers: [
    { provide: MarketingCustomerService, useClass: MarketingCustomerForSourceService }
  ]
})
export class SoCustomerRoutingModule { }
