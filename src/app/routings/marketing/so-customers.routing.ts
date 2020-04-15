import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  MarketingCustomerService
} from '@uni/customer';
import {MarketingCustomerForSourceService} from '../../_modules/customers/services/marketing-customer-for-source.service';
import {
  CustomersPageComponent,
  CustomerPageComponent,
  CustomersModule,
  CustomerEditPageComponent,
  CustomerImportPageComponent
} from 'src/app/_modules/customers/customers';

const routes: Routes = [
  { path: '', component: CustomersPageComponent },
  { path: '_create', component: CustomerEditPageComponent },
  { path: '_import', component: CustomerImportPageComponent },
  { path: ':customerId', component: CustomerPageComponent  }
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
