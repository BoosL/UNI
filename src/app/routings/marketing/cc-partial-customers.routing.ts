import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MarketingCustomerService,
} from '@uni/customer';
import {MarketingCustomerForCcService} from '../../_modules/customers/services/marketing-customer-for-cc.service';
import { PartialCustomersPageComponent, CustomersModule } from 'src/app/_modules/customers/customers';

const routes: Routes = [
  { path: '', component: PartialCustomersPageComponent }
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
    { provide: MarketingCustomerService, useClass: MarketingCustomerForCcService }
  ]
})
export class CcPartialCustomerRoutingModule { }
